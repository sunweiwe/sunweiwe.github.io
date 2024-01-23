---
date: 2022-10-24T21:39:36+08:00
slug: /kubernetes/mysql
tags:
  - kubernetes
title: stateful 部署 mysql
summary: kubernetes 使用 stateful 方式部署 mysql
---

## 部署 nfs server

- 安装软件包

```bash
yum install -y rpcbind nfs-utils
```

- 修改 /etc/exports

```bash
  /hone/nfs/ \*(insecure,rw,sync,no_root_squash)
```

- 启动 nfs 服务

```bash
mkdir /home/nfs

systemctl enable rpcbind
systemctl enable nfs-server

systemctl start rpcbind
systemctl start nfs-server
exportfs -r
exportfs
```

## 创建 RABC

### 用户创建 nfs client

```yml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  namespace: default
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-client-provisioner-runner
rules:
  - apiGroups: ['']
    resources: ['persistentvolumes']
    verbs: ['get', 'list', 'watch', 'create', 'delete']
  - apiGroups: ['']
    resources: ['persistentvolumeclaims']
    verbs: ['get', 'list', 'watch', 'update']
  - apiGroups: ['storage.k8s.io']
    resources: ['storageclasses']
    verbs: ['get', 'list', 'watch']
  - apiGroups: ['']
    resources: ['events']
    verbs: ['create', 'update', 'patch']
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-client-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    namespace: default
roleRef:
  kind: ClusterRole
  name: nfs-client-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  namespace: default
rules:
  - apiGroups: ['']
    resources: ['endpoints']
    verbs: ['get', 'list', 'watch', 'create', 'update', 'patch']
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  namespace: default
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    namespace: default
roleRef:
  kind: Role
  name: leader-locking-nfs-client-provisioner
  apiGroup: rbac.authorization.k8s.io
```

## 部署 nfs client

### 用于自动创建 pvc

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: registry.cn-hangzhou.aliyuncs.com/jimywu/nfs-subdir-external-provisioner:v4.0.0
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: k8s-sigs.io/nfs-subdir-external-provisioner
            - name: NFS_SERVER
              value: 10.0.24.13
            - name: NFS_PATH
              value: /home/nfs
      volumes:
        - name: nfs-client-root
          nfs:
            server: 10.0.24.13
            path: /home/nfs
```

## 创建 StorageClass

### 用于 mysql 自动扩容或者所容绑定 pvc

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: mysql-storage
provisioner: k8s-sigs.io/nfs-subdir-external-provisioner
reclaimPolicy: Retain
volumeBindingMode: Immediate
```

## 创建 StatefulSet

```yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-backend
spec:
  selector:
    matchLabels:
      app: mysql # 匹配 .spec.template.metadata.labels
  serviceName: mysql-svc-master
  replicas: 1
  template:
    metadata:
      labels:
        app: mysql # 匹配 .spec.selector.matchLabels
    spec:
      initContainers:
        - name: init-mysql
          image: mysql:8.0
          command:
            - bash
            - '-c'
            - |
              set ex
              # Generate mysql server-id from pod ordinal index.
              [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
              ordinal=${BASH_REMATCH[1]}
              echo [mysqld] > /mnt/conf.d/server-id.cnf
              # Add an offset to avoid reserved server-id=0 value.
              echo server-id=$((100 + $ordinal)) >> /mnt/conf.d/server-id.cnf
              # Copy appropriate conf.d files from config-map to emptyDir.
              if [[ $ordinal -eq 0 ]]; then
                cp /mnt/config-map/master.cnf /mnt/conf.d/
              else
                cp /mnt/config-map/slave.cnf /mnt/conf.d/
              fi
          volumeMounts:
            - name: conf
              mountPath: /mnt/conf.d
            - name: config-map
              mountPath: /mnt/config-map
        - name: clone-mysql
          image: mzmuer/xtrabackup:1.0
          command:
            - bash
            - '-c'
            - |
              set -ex
              # Skip the clone if data already exists.
              [[ -d /var/lib/mysql/mysql ]] && exit 0
              # Skip the clone on master (ordinal index 0).
              [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
              ordinal=${BASH_REMATCH[1]}
              [[ $ordinal -eq 0 ]] && exit 0
              # Clone data from previous peer.
              ncat --recv-only mysql-ss-$(($ordinal-1)).mysql-svc-master 13306 | xbstream -x -C /var/lib/mysql
              # Prepare the backup.
              xtrabackup --prepare --target-dir=/var/lib/mysql
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
              subPath: mysql
            - name: conf
              mountPath: /etc/mysql/conf.d
      containers:
        - name: mysql
          image: mysql:8.0
          args: ['--default-authentication-plugin=mysql_native_password']
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: '4rt5$RT%'
          ports:
            - name: mysql
              containerPort: 3306
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
              subPath: mysql
            - name: conf
              mountPath: /etc/mysql/conf.d
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            exec:
              command: ['mysqladmin', '-uroot', '-p${MYSQL_ROOT_PASSWORD}', 'ping']
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
          readinessProbe:
            exec:
              # Check we can execute queries over TCP (skip-networking is off).
              command: ['mysqladmin', '-uroot', '-p${MYSQL_ROOT_PASSWORD}', 'ping']
            initialDelaySeconds: 5
            periodSeconds: 2
            timeoutSeconds: 1
        - name: xtrabackup
          image: mzmuer/xtrabackup:1.0
          ports:
            - name: xtrabackup
              containerPort: 13306
          command:
            - bash
            - '-c'
            - |
              set -ex
              cd /var/lib/mysql
              # Determine binlog position of cloned data, if any.
              if [[ -s xtrabackup_slave_info ]]; then
                # XtraBackup already generated a partial "CHANGE MASTER TO" query
                # because we're cloning from an existing slave.
                mv xtrabackup_slave_info change_master_to.sql.in
                
                # Ignore xtrabackup_binlog_info in this case (it's useless).
                rm -f xtrabackup_binlog_info
              elif [[ -f xtrabackup_binlog_info ]]; then
                # We're cloning directly from master. Parse binlog position.
                [[ `cat xtrabackup_binlog_info` =~ ^(.*?)[[:space:]]+(.*?)$ ]] || exit 1
                rm xtrabackup_binlog_info
                echo "CHANGE MASTER TO MASTER_LOG_FILE='${BASH_REMATCH[1]}',\
                      MASTER_LOG_POS=${BASH_REMATCH[2]}" > change_master_to.sql.in
              fi
              # Check if we need to complete a clone by starting replication.
              if [[ -f change_master_to.sql.in ]]; then
                echo "Waiting for mysqld to be ready (accepting connections)"
                until mysql -h 127.0.0.1 -e "SELECT 1"; do sleep 1; done
                echo "Initializing replication from clone position"
                # In case of container restart, attempt this at-most-once.
                mv change_master_to.sql.in change_master_to.sql.orig
                mysql -h 127.0.0.1 <<EOF
              $(<change_master_to.sql.orig),
                MASTER_HOST='mysql-ss-0.mysql-svc-master',
                MASTER_USER='root',
                MASTER_PASSWORD='',
                MASTER_CONNECT_RETRY=10;
              START SLAVE;
              EOF
              fi
              # Start a server to send backups when requested by peers.
              exec ncat --listen --keep-open --send-only --max-conns=1 13306 -c \
                "xtrabackup --backup --slave-info --stream=xbstream --host=127.0.0.1 --user=root"
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
              subPath: mysql
            - name: conf
              mountPath: /etc/mysql/conf.d
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
            limits:
              cpu: 200m
              memory: 200Mi
      volumes:
        - name: conf
          emptyDir: {}
        - name: config-map
          configMap:
            name: mysql
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        storageClassName: 'mysql-storage'
        accessModes: ['ReadWriteOnce']
        resources:
          requests:
            storage: 10Gi
```
