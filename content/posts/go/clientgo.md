---
date: 2023-01-20T16:09:28+08:00
slug: /go/clientgo
tags:
  - Go
title: clientgo
draft: true
summary: client go for kubernets
---

# 模块

## Reflector

Reflector 向 apiserver watch 特定类型的资源，拿到变更通知后将其丢到 DeltaFIFO 队列中。
