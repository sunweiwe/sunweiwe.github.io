---
date: 2023-03-14T20:19:47+08:00
toc: true
slug: /linux/cgroup
tags:
  - linux
  - cgroup
title: cgroup
---

<!--abstract-->

for linux [cgroup](https://docs.kernel.org/admin-guide/cgroup-v2.html)

<!--more-->


## cgroup

### mount

目前支持的挂载方式为：
- nsdelegate
- favordynmods
- memory_localevents
    - 只能挂载时设置或者通过从 init 命名空间重新挂载来修改，这是系统范围的选项。只用当前 cgroup 的数据填充 memory.events，如果没有这个选项，默认会计数所有子树；
- memory_recursiveprot
    - 递归地将 memory.min 和 memory.low 保护应用于整个子树，无需显式向下传播到叶节点的 cgroup 中，子树内叶子节点可以自由竞争

### 组织进程和线程

#### 进程
 每个 cgroup 有一个可读写的的文件 `cgroup.procs`

#### 线程