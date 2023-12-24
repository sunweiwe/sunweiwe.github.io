---
date: 2023-11-15T06:51:00Z

slug: /java/class
tags:
  - Java
title: class
draft: false
---
<!--abstract-->
类的使用
<!--more-->


## 面向对象
- 封装
- 继承
- 多态

## 类

- 构造器和类同名
- 每个类可以有一个以上构造器
- 构造器可以有0,1或多个参数
- 构造器没有返回值
- 构造器总伴随着new操作符一起调用


## 继承

> 使用 extends

### 覆盖方法

> override


### 阻止继承: fianl类和方法


## 泛型数组列表(容器)

### 声明
```java
ArrayList<String> s = new ArrayList<String>();

var s = new ArrayList<String>();

ArrayList<String> s = new ArrayList<>();
```

## 对象包装器与自动装箱

- Integer
- Long
- Float
- Double
- Short
- Byte
- Character
- Boolean


## 接口

### 概念

> 接口不是类, 而是对希望符合这个接口的类的一组需求


### 类实现接口

- 将类声明为实现给定的接口
- 对接口中的所有方法提供定义

```java
class Employee implements Comparable<Employee> {

  public int compareTo(Object otherObject){
    Employee other = (Emplyoee) otherObject;
    return Double.compare(salary,other.salary);
  }

}
```