---
date: 2023-11-15T03:07:11Z
toc: true
slug: /synatx
tags:
  - Java
  - Synatx
title: synatx
draft: true
---


## 数据类型

> 八种基本类型，其中四种整型，两种浮点类型，1种字符串类型和一种真值类型

### 整型

| 类型 | 存储需求 | 取值范围 |
|-|-|-|
| int | 4字节 | -2147483648 ~ 2147483647 |
| short | 2字节 | -32768 ~ 32767 |
| long | 8字节 | -9223372036854775808 ~ 9223372036854775807 |
| byte | 1字节 | -128 ~ 127 |


### 浮点型

| 类型 | 存储需求 | 取值范围 |
| - | - | - |
| float | 4字节 | 大约 +- 3.40282347E+38F (有效位数为6~7位)|
| double | 8字节 | 大约 +- 1.79769313486231570E+308 (有效位数为15位) |

### 常量

>  使用 final 指示常量，使用 static final 声明类常量。

### 枚举类型

```java
enum Size {
  SMALL,
  MEDIUM,
  LARGE,
  EXTRA_LARGE
};

```
### 位运算符

- & and
- | or
- ^ xor
- ~ not
- << 右移
- >> 左移


### 字符串

> 使用 equals 方法检测是否相等。 == 只能确定是否存放在同一个位置。


```java
StringBuilder builder = new StringBuilder();

builder.append(ch);

String completedString = builder.toString();
```

## 输入与输出

### 读取输入

```java
Scanner in = new Scanner(System.in);

System.out.print("What's up?");

String name = in.nextLine();

String firstName = in.next();

// 读取密码
Console cons = System.consloe();
String username = cons.readLine("User name: ");
char[] password = cons.readPassword("Password: ");

```

### 格式化输出

> System.out.print, System.out.printf


| 转换符 | 类型 | 实例 | 
|-|-|-|
| d | 十进制整数 | 159 |
| x | 十六进制整数 | 9f |
| o | 八进制整数 | 237 |
| f | 定点浮点数 | 15.9 |
| e | 指点浮点数 | 15.9e+01 |
| g | 通用浮点数（e和f中较短的一个） | 15.9e+01 |
| a | 十六进制浮点数 | 0x1.fccdp3 |
| s | 字符串 | Hello |
| c | 字符 | H |
| b | 布尔 | true |
| h | 散列码 | 42628b2 |
| tx或Tx | 日期时间(T强制大写) | 已经过时，使用 java.time |
| n | 与平台有关的行分隔符 | - |


### 文件输入于输出

```java

// 读文件
Scanner in = new Scanner(Path.of("file.txt"),StandardCharsets.UTF_8);

// 写文件
PrintWriter out = new PrintWriter("file.txt",StandardCharsets.UTF_8);

```


## 大数

> BigInter & BigDecimal

```java
Biginteger value = BigInteger.valueOf(100);

BigInteger r = new BigInteger("222323421312432423423423432423432423423434");


```

### constants
- BigInteger.ZERO
- BigInteger.ONE
- BigInteger.TEN
- BigInteger.TWO

> 大数的算术运算需要使用 add 和 multiply  方法

```java

lotteryOdds = lotteryOdds * (n - i + 1)/i;

lotteryOdds = lotteryOdds.multiply(BigInterger.valueOf(n - i + 1)).divide(BigInteger.valueOf(i));

```

##  数组

### 声明数组

```java
int[] numbers;

int a = new int[100];

int[] s = { 2,3,4};


for(int v: s){
  System.out.println(v);
}

```

### 数组拷贝

```java
//  指向同一个地址
int[] before = {1,2};
int[] after = before;

// 拷贝到新的数组中
int[] differ = Arrays.copyOf(before,before.length);


```

### 数组排序

> sort 方法使用了优化的快速排序算法

```java
int[] a = new int[1000];
Arrays.sort(a);
```