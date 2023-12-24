---
date: 2022-10-23T22:58:31+08:00

slug: /linux/command
tags:
  - linux
title: command
draft: true
---

<!--abstract-->

for linux command

<!--more-->

### 查看子进程

- pstree
- 第一个进程是 systemd
-

### 脚本文件可执行权限

```bash
chmod +x name.sh
```

### 输出

- echo
- \t
- \b

### 查看登录过的用户

```bash
who

who | wc -l

```

### 写文件

```bash
#覆盖式的
echo "content" > name.text

cat name.text

#追加式
echo "new content" >> name.text
```

### 创建文件

```bash
touch a b c

touch "a b c"

rm -rf a b c
```

### 备份文件

```bash
tar -czf /root/log-`date +%Y%m%d`.tar.gz /var/log/
```

### 移动文件和修改文件名

```bash
mv name mame
mv name /name
```

### 文本操作

```bash
# text 要搜索的文本 file 供搜索的文件
grep text file
```

- -r 递归查找
- -i 忽略大小写
- -v 只显示搜索文本不在的那些行
- -n 显示行号

### 对文件的行进行排序

```bash
sort name.text
```

- -o 排序后写入新文件
- -r 倒序排序
- -R 随机排序
- -n 对数学排序

### wc

```bash
wc name.text
```

- -l 只统计行
- -w 只统计单词数
- -c 只统计字节数
- -m 只统计字符数

### cut

```bash
cut -c 2-4 name.text
```

### 输出重定向

```bash
cut -d, -f 1 note.csv > name.csv
```

### 查看进程

```bash
w

# 当前系统的进程，相当于执行时的快照

```

### ps

- `ef`  列出所有进程;
- `efH`  以乔木状列举出所有进程;
- `u`  列出此用户运行的进程;
- `aux`  通过 `CPU`  和内存使用来过滤进程 `ps -aux | less` ;
- `aux --sort -pcpu`  按 `CPU`  使用降序排列， `aux --sort -pmem`  表示按内存使用降序排列;
- `axjf`  以树形结构显示进程， `ps -axjf`  它和 `pstree`  效果类似。

### top

获取进程的动态列表

### tar

```bash
tar -cvf sort.tar sort/

tar -zcvf archive.tar.gz archive/
```

- `cvf`  表示 `create`（创建）+ `verbose`（细节）+ `file`（文件），创建归档文件并显示操作细节；
- `tf`  显示归档里的内容，并不解开归档；
- `rvf`  追加文件到归档， `tar -rvf archive.tar file.txt` ；
- `xvf`  解开归档， `tar -xvf archive.tar` 。
