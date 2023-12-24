---
date: 2023-03-14T20:19:47+08:00

slug: /linux/ubuntu
tags:
  - docker
  - ubuntu
title: Ubuntu in docker
---

<!--abstract-->

<!--more-->

## 拉取镜像

```bash
docker pull ubuntu
```

## 创建容器

```bash
docker run -i -t --name ubuntu ubuntu bash
```

## Ubuntu 基本配置

```bash
apt-get update
apt-get install vim
```

### 更新软件源

/etc/apt/sources.list

```bash
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

```bash
apt-get update
apt-get install git
```

### 配置 SSH

```bash
apt-get install openssh-server
```

### 配置 sshd

/etc/ssh/sshd_config

```bash
PermitRootLogin yes # 可以登录 root 用户
PubkeyAuthentication yes # 可以使用 ssh 公钥许可
AuthorizedKeysFile	.ssh/authorized_keys # 公钥信息保存到文件 .ssh/authorized_keys 中
```

### 重启 sshd

```bash
/etc/init.d/ssh restart
```

### 主机 SSH 公钥

- 在 HOME 目录下创建 .ssh 目录：mkdir ~/.ssh
- 新建文件 ~/.ssh/authorized_keys ：touch ~/.ssh/authorized_keys
- 新开一个 macOS 下的终端窗口，执行命令 cat ~/.ssh/id_rsa.pub，复制打印的一行公钥信息
- 回到 ubuntu 容器中，将第 3 步复制的公钥粘贴到 ~/.ssh/authorized_keys 中保存。

## 提交修改到镜像

```bash
docker commit -m <Comment> -a <Author> <containerId> <ImageName>
```
