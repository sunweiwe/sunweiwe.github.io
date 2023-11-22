---
date: 2023-11-22T07:44:47Z
toc: true
slug: /database/synatx
tags:
  - Database
title: database synatx
draft: true
---


## 数据库

### CRUD

#### Insert

```sql

INSERT INTO user
VALUES (10,'root','root',"name@163.com"),(11,'user','user',"name@163.com");


INSERT INTO user(username, password, email)
VALUES ('admin', 'admin', 'xxxx@163.com');

```

#### Update

```sql
UPDATE user
SET username='root',password='root'
WHERE username = 'root';
```


#### Delte

```sql
DELETE FROM user
WHERE username = 'root';


// 清空表数据
TRUNCATE TABLE user;

```

#### Select

```sql
SELECT name FROM user;

SELECT id,name FROM user;

SELECT * FROM user;

SELECT DISINCT id FROM user;

SELECT * FROM user LIMIT 5;

SELECT * FROM user LIMIT 0,5;

SELECT * FROM user LIMIT 2,3;

```


### 排序

```sql

// desc 降序

SELECT * FROM user
ORDER BY create_time ASC, age DESC
```


### 分组

```sql
SELECT name, COUNT(address) AS addr_count 
FROM user GROUP BY name;

SELECT name, COUNT(address) AS addr_count 
FROM user GROUP BY name
ORDER BY name DESC;

```

#### having

- 对汇总的 `group by` 结果进行过滤
- 一般和 `group by` 连用

```sql
SELECT name, COUNT(*) AS count
FROM user
WHERE email IS NOT NULL
GROUP BY name
HAVING COUNT(*) >= 1;

```


### 子查询

#### where

```sql
select column_name [, column_name ]
from   table1 [, table2 ]
where  column_name operator
    (select column_name [, column_name ]
    from table1 [, table2 ]
    [where])

```

#### from

```sql
select column_name [, column_name ]
from (select column_name [, column_name ]
      from table1 [, table2 ]
      [where]) as temp_table_name
where  condition

```

#### IN,BETWEEN

```sql
SELECT *
FROM user
WHERE id IN ('1', '2');

SELECT *
FROM user
WHERE age BETWEEN 3 AND 5;

```

#### AND,OR,NOT

```sql

SELECT id, name, address
FROM user
WHERE name = 'name' AND age >= 18;

SELECT id, name, address
FROM user
WHERE name = 'name' OR age >= 18;


SELECT *
FROM user
WHERE age NOT BETWEEN 8 AND 18;

```


### 连接

> 连接表的本质就是将不同表的记录合并起来，形成一张新表。当然，这张新表只是临时的，它仅存在于本次查询期间。

```sql
# join....on
select c.cust_name, o.order_num
from Customers c
inner join Orders o
on c.cust_id = o.cust_id
order by c.cust_name;

# 如果两张表的关联字段名相同，也可以使用USING子句：join....using()
select c.cust_name, o.order_num
from Customers c
inner join Orders o
using(cust_id)
order by c.cust_name;

```

| 连接类型 | 说明 |
|-|-|
| inner join | （默认链接方式）只有两个标都存在满足条件的记录才会返回行。 |
| left join/left outer join | 返回左表的所有行，即使右表中没有满足条件的行也是如此。 |
| right join/right outer join | 返回右表中的所有行，即使左表没有满足条件的行也是如此。 |
| full join/full outer join | 返回其中一个表存在满足条件的记录。 |
| self join | 将一个表连接到自身，就像该表是两个表一样。为了区分两个表，在 SQL 语句中需要至少重命名一个表。|
| cross join | 交叉连接，从两个或者多个连接表中返回记录集的笛卡尔积。 |


### 组合

> UNION 运算符将两个或更多查询的结果组合起来，并生成一个结果集，其中包含来自 UNION 中参与查询的提取行。

UNION 基本规则：
- 所有查询的列数和列顺序必须相同。
- 每个查询中涉及表的列的数据类型必须相同或兼容。
- 通常返回的列名取自第一个查询


```sql
SELECT column_name(s) FROM table1
UNION ALL
SELECT column_name(s) FROM table2;
```

### 函数

### 数据库定义

#### 数据库

```sql
CREATE DATABASE test;

DROP DATABASE test;

USE test;
```

#### 数据表

```sql
CREATE TABLE user (
  id int(10) unsigned NOT NULL COMMENT 'Id',
  username varchar(64) NOT NULL DEFAULT 'default' COMMENT '用户名',
  password varchar(64) NOT NULL DEFAULT 'default' COMMENT '密码',
  email varchar(64) NOT NULL DEFAULT 'default' COMMENT '邮箱'
) COMMENT='用户表';


CREATE TABLE vip_user AS
SELECT * FROM user;


DROP TABLE user;


ALTER TABLE user 
ADD age int(3);


ALTER TABLE user
DROP COLUMN age;

ALTER TABLE `user`
MODIFY COLUMN age tinyint;


ALTER TABLE user
ADD PRIMARY KEY (id);

ALTER TABLE user
DROP PRIMARY KEY;

```


#### 视图

##### 定义

- 视图是基于 SQL 语句的结果集的可视化的表。
- 视图是虚拟的表，本身不包含数据，也就不能对其进行索引操作。对视图的操作和对普通表的操作一样。

##### 作用

- 简化复杂的 SQL 操作，比如复杂的联结；
- 只使用实际表的一部分数据；
- 通过只给用户访问视图的权限，保证数据的安全性；
- 更改数据格式和表示。


```sql
CREATE  VIEW top_10_user_view AS
SELECT id,name
FROM user
WHERE id < 10;

DROP VIEW top_10_user_view;
```

#### 索引

> 索引是一种用于快速查询和检索数据的数据结构，其本质可以看成是一种排序好的数据结构。

```sql

CREATE INDEX user_index
ON user (id);

ALTER table user ADD INDEX user_index(id)

CREATE UNIQUE INDEX user_index
ON user (id);

ALTER TABLE user
DROP INDEX user_index;
```

#### 约束

- NOT NULL
- UNIQUE
- PRIMARY KEY
- FOREIGN KEY
- CHECK
- DEFAULT

```sql
CREATE TABLE Users (
  Id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增Id',
  Username VARCHAR(64) NOT NULL UNIQUE DEFAULT 'default' COMMENT '用户名',
  Password VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT '密码',
  Email VARCHAR(64) NOT NULL DEFAULT 'default' COMMENT '邮箱地址',
  Enabled TINYINT(4) DEFAULT NULL COMMENT '是否有效',
  PRIMARY KEY (Id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

```


### 事务处理



- START TRANSACTION - 指令用于标记事务的起始点。
- SAVEPOINT - 指令用于创建保留点。
- ROLLBACK TO - 指令用于回滚到指定的保留点；如果没有设置保留点，则回退到 START TRANSACTION 语句处。
- COMMIT - 提交事务。

```sql
-- 开始事务
START TRANSACTION;

-- 插入操作 A
INSERT INTO `user`
VALUES (1, 'root1', 'root1', 'xxxx@163.com');

-- 创建保留点 updateA
SAVEPOINT updateA;

-- 插入操作 B
INSERT INTO `user`
VALUES (2, 'root2', 'root2', 'xxxx@163.com');

-- 回滚到保留点 updateA
ROLLBACK TO updateA;

-- 提交事务，只有操作 A 生效
COMMIT;

```

### 存储过程

- 代码封装，保证了一定的安全性；
- 代码复用；
- 由于是预先编译，因此具有很高的性能。


```sql
DROP PROCEDURE IF EXISTS `proc_adder`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_adder`(IN a int, IN b int, OUT sum int)
BEGIN
    DECLARE c int;
    if a is null then set a = 0;
    end if;

    if b is null then set b = 0;
    end if;

    set sum  = a + b;
END
;;
DELIMITER ;

```