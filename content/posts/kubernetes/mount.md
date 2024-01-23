---
date: 2022-10-26T22:11:15+08:00
slug: /kubernetes/mount
tags:
  - Go
  - kubernetes
title: kubernetes 部署
summary: 使用 kubeadm 在 liunx 上安装 kubernetes
---
## 关闭防火墙

```bash
systemctl disable firewalld
systemctl stop firewalld
```

## 关闭 selinux

```bash
setenforce 0
sed -i 's/SELINUX=permissive/SELINUX=disabled/' /etc/sysconfig/selinux
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
```

## 关闭 swap

```bash
swapoff -a
sed -i 's/.*swap.*/#&/' /etc/fstab
```

## 添加主机名与 IP 对应的关系

```bash
hostnamectl set-hostname k8s-master

vim /etc/hosts
#添加如下内容：
10.0.24.13    k8s-master
```

## 将桥接的 IPV4 流量传递到 iptables 的链

```bash
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```

## yum

```bash
**rm -rfv /etc/yum.repos.d/*
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-8.repo
yum install -y yum-utils
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 配置k8s阿里云源
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF**
```

## 基础包

```bash
yum install vim bash-completion net-tools gcc -y
```

## docker

```bash
yum install docker-ce
systemctl start docker # 启动Docker
systemctl enable docker # 设置自动启动
```

### docker config

```bash
/etc/docker/daemon.json
{
	"registry-mirrors": [
		"https://56tyyl4k.mirror.aliyuncs.com"
  ],
  "exec-opts": ["native.cgroupdriver=systemd"]
}

systemctl daemon-reload
systemctl restart docker
```

## kubernetes 组件

```bash
yum install -y kubectl kubeadm kubelet

systemctl enable kubelet && systemctl start kubelet
```

## 初始化

```bash
kubeadm init  --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.23.1 --pod-network-cidr=10.0.24.13/16

kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

## kubectl config

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

source <(kubectl completion bash)
```

## 污点

```bash
kubectl taint nodes k8s-master node-role.kubernetes.io/master:NoSchedule-
```
