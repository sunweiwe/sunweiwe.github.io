---
date: 2022-10-23T15:46:14+08:00
toc: true
slug: /kubernetes/basic
tags:
  - kubernetes
title: kubernetes
---

<!--abstract-->

kubernetes 基本的知识

<!--more-->

## Pod

### 指定终止宽限期

```bash
kubectl delete po podname --grace-period=5-
```

### token

```bash

kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```

### docker sercrets

```bash
kubectl create secret generic docker \
    --from-file=.dockerconfigjson=/root/.docker/config.json \
    --type=kubernetes.io/dockerconfigjson
```

## kubectl

### 多集群使用 kubectl

```yml
apiVersion: vl
clusters:
- cluster:
		certificate-authority: /home/sunweiwe/.minikube/ca.crt
		server: https://192.168.99.100:8443
	name: minikube
contexts:
- context:
		cluster: minikube
		user: minikube
		namespace: default
name: minikube
current-context: minikube
kind: Config
preferences: {}
users:
- name: minikube
	user: client-certificate: /home/sunweiwe/ .minikube/apiserver.crt
	client-key: /home/sunweiwe/ .minikube/apiserver.key
```

## kubernetes 源码调试

