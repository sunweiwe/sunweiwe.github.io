---
date: 2022-10-24T16:42:20+08:00

slug: /docker/basic
tags:
  - docker
title: docker basic
---

<!--abstract-->

docker 基本的知识

<!--more-->

## 构建镜像

```bash
docker build -t mysql:v8.0
```

## 查看 pod 的日志

```bash
kubectl describe pod podname
```

## 进入容器

```bash
kubectl exec -it podname bash
```

## 启动容器

```bash
docker run -dit --name emqx -p 18083:18083 -p 1883:1883 -p 8083:8083 -p 8084:8084 -v /etc/localtime:/etc/localtime --restart=always emqx/emqx:latest
```

## 查看 container

```bash
# 运行的容器
docker ps

# 所有的容器
docker ps -a

#format
docker ps --format "table {{.ID}} {{.Image}} {{.Names}} {{.Ports}}"

# 删除停止的容器
docker container prune
```
