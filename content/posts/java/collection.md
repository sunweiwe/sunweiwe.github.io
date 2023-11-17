---
date: 2023-11-14T03:37:48Z
toc: true
slug: /java/collection
tags:
  - Java
  - Collection
title: basic
draft: true
---


## 集合(容器)

### 接口和实现分离

```java

//  队列接口

public interface Queue<E>
{
  void add(E element);
  E remove();
  int size();
}

//
public class CircularArrayQueue<E> implements Queue<E>
{
  private int head;
  private int tail;

  CircularArrayQueue(int capacity) {}
  public void add(E element){}
  public E remove() {}
  public int size() {}
  
  private E[] elements;

}

public class LinkedListQueue<E> implements Queue<E>
{
  private Link head;
  private Link tail;

  LinkedListQueue() {}
  public void add(E element) {}
  public E remove() {}
  public int size() {}
}



```

#### 迭代器

> 使用 next 方法逐个访问集合中的每个元素。但是，如何到达集合的末尾，next 方法将抛出一个 `NoSuchElementException`

```java
Collection<String> c =...;
Iterator<String> iter = c.iterator();
while(iter.hasNext())
{
  String element = iter.next();
  // logic
}

// or

for(String element : c){
  // logic
}

// for 
```


> 集合(容器)。分为两类: Collection 和 Map


```java
public interface Collection<E>
{
  boolean add(E element);
  Iterator<E> iterator();
  
}


public interface Iterator<E>
{
  E next();
  boolean hasNext();
  void remove();
  default void forEachRemaining(Consumer<? super E>  action);
}

public interface Iterable<E>
{
  Iterator<E> iterator();
}
```


### Collection

> `Collection` 接口扩展了 `Iterable` 接口

- `Set`
  > `add` 方法不允许增加重复的元素。`equals` 方法认为两个集合包含相同的元素就相等，不要求顺序相同。

  - `HashSet`: 无续，唯一。基于HashMap实现

  - `TreeSet`: 有序，唯一。红黑树（自平衡的排序二叉树）
    
    ```java
      SortedSet<String> sorter = new TreeSet<>();
      sorter.add("Bob");
      sorter.add("Amy");
      sorter.add("Carl");
      for (String s : sorter)
        System.out.println(s);

    ```

  - `LinkedHashSet`: `LinkedHashSet` 是 `HashSet` 的子类，并且其内部是通过 `LinkedHashMap` 来实现的。

  

- `List`
  > 分为两种实现，数组和链表。数组支持随机访问。

  ```java
    if (c instanceof RandomAccess){
      // 使用随机访问算法
    }else{
      // 线性访问
    }

  ```

  - `ArrayList`: `Object[]` 数组



  - `LinkedList`: 双向链表
    - 双端队列的链表实现。

    ```java
      List<String> staff = new LinkedList<>();
      staff.add("Amy");
      staff.add("Bob");
      staff.add("Carl");
      ListIterator<String> iter = staff.listIterator();
      iter.next();
      iter.add("Juliet");
    ```


- `Queue`
  - `PriorityQueue`: `Object[]` 数组实现的小顶堆

    ```java
      PriorityQueue<LocalDate> pq = new PriorityQueue<>();
    
    ```

  - `DelayQueue`: `PriorityQueue`

  - `ArrayDeque`: 可扩容动态双向数组。
    - 线程不安全。
    - 不支持 `null` 值。
    - 双端队列的数组实现。


### Map

- `HashMap`: JDK1.8 之前 `HashMap` 由数组+链表组成的，数组是 `HashMap` 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）。JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间。

  ```java
    Map<String,User> user = new HashMap<>();
    user u = new User("Sun");
    user.add("<key>",u);
  ```


- `LinkedHashMap`: `LinkedHashMap` 继承自 `HashMap`，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，`LinkedHashMap` 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。

  //! TODO
  ```java

  ```

- `Hashtable`: 数组+链表组成的，数组是 `Hashtable` 的主体，链表则是主要为了解决哈希冲突而存在的。

- `TreeMap`: 红黑树（自平衡的排序二叉树）。