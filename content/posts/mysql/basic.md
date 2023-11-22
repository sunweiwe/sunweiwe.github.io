---
date: 2022-10-23T22:53:58+08:00
toc: true
slug: /mysql/basic
tags:
  - mysql
title: mysql basic
draft: true
---

<!--abstract-->

mysql basic

<!--more-->

### 覆盖索引

- 就是 select 的数据列只用从索引中就能够取得，不必读取数据行，MySQL 可以利用索引返回 select 列表中的字段，而不必根据索引再次读取数据文件，换句话说**查询列要被所建的索引覆盖**。
- 索引是高效找到行的一个方法，但是一般数据库也能使用索引找到一个列的数据，因此它不必读取整个行。毕竟索引叶子节点存储了它们索引的数据，当能通过读取索引就可以得到想要的数据，那就不需要读取行了。一个索引包含（覆盖）满足查询结果的数据就叫做覆盖索引。
- 使用 explain，可以通过输出的 extra 列来判断，对于一个索引覆盖查询，显示为**using index**，MySQL 查询优化器在执行查询前会决定是否有索引覆盖查询

### 性能优化

- **慢查询日志**，**EXPLAIN 分析查询**，**profiling 分析**以及**show 命令查询系统状态及系统变量**

### explain

- 表的读取顺序
- 数据读取操作的操作类型
- 哪些索引可以使用
- 哪些索引被实际使用
- 表之间的引用
- 每张表有多少行被优化器查询