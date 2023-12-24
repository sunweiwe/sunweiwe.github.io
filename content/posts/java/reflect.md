---
date: 2023-11-15T02:28:38Z

slug: /java/reflect
tags:
  - Java
  - Reflect
title: reflect
draft: false
---
<!--abstract-->
Java 反射基本使用
<!--more-->


## 使用场景

> 比如下面是通过 JDK 实现动态代理的示例代码，其中就使用了反射类 Method 来调用指定的方法。

- 运行时分析类的能力
- 在运行时检查对象
- 实现泛型数组操作代码
- 利用method对象

```java
public class DebugInvocationHandler implements InvocationHandler {
    /**
     * 代理类中的真实对象
     */
    private final Object target;

    public DebugInvocationHandler(Object target) {
        this.target = target;
    }


    public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        System.out.println("before method " + method.getName());
        Object result = method.invoke(target, args);
        System.out.println("after method " + method.getName());
        return result;
    }
}

```


## 基本操作
```java
package cn.app

public class TargetObject {
  private String value;

  public TargetObject() {
    value = "App"
  }

  public void publicMethod(String s) {
    System.out.println("This is "+ s );
  }

  private void privateMethod(){
    System.out.println("value is "+ value); 
  }
}
```

```java
package cn.app;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class Main {
  public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException, NoSuchFieldException {

    /**
     *  获取 TartgetObject 类的Class 对象并且创建 TartgetObject 类实例
     */
    Class<?> tartgetClass = class.forName("cn.app.TartgetObject");
    TargetObject tartgetObject = (TargetObject) targetClass.newInstance();

    Method[] methods = targetClass.getDeclaredMethods();
    for (Method method: methods){
      System.out.println(method.getName());
    }

    Method publicMethod = targetClass.getDeclaredMethod("publicMethod",String.class);

    publicMethod.invoke(tartgetObject,"sunweiwe");

    Field field = tartgetClass.getDeclaredField("value");

    field.setAccessible(true);
    field.set(tartgetObject,"sunweiwe");

    Method privateMethod = tartgetClass.getDeclaredMethod("privateMethod");
    privateMethod.setAccessible(true);
    privateMethod.invoke(tartgetObject);
  }
}
```