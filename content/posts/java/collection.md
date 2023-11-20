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

    ```java
      Set<String> words = new HashSet<>(Arrays.asList("A", "A", "B", "C", "B", "My", "MY", "My"));
      words.add("D");

      for (String w : words) {
        System.out.println(w);
      }

      Iterator<String> iterator = words.iterator();
      while (iterator.hasNext()) {
        System.out.println(iterator.next());
      }
    ```

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
    - 非同步，线程不安全
    - 继承自 `AbstractList`，实现了 `List` `RandomAccess` `Cloneable` `java.io.Serializable` 接口。

    ```java
      public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAceess, Cloneable, java.io.Serializeable {
        private static final long serivalVersionUID = 8683452581122892189L;

        /**
         * 默认初始化大小
         */
        private static final int DEFAULT_CAPACITY = 10;

        /**
         * 空数组 
         */ 
        private static final Object[] EMPTY_ELEMENTDATA = {};

        //用于默认大小空实例的共享空数组实例。
        //我们把它从EMPTY_ELEMENTDATA数组中区分出来，以知道在添加第一个元素时容量需要增加多少。
        private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};




      }

    ```
  
    ```java
      
      List<String> chars = new ArrayList<>();
      // or
      List<String> names = new ArrayList<>(Arrays.asList("A", "B", "C"));

      chars.add("A");
      chars.add("B");
      chars.add("C");
    
      name.removeIf(c->c.equals("B"));
      System.out.println(names.size());

      // c 是 cllection
      names.addAll(c);

      // true
      names.contains("A");

    ```



  - `LinkedList`: 双向链表
    - 双端队列的链表实现。
    - 不支持随机访问。


    ```java
      List<String> staff = new LinkedList<>();
      staff.add("Amy");
      staff.add("Bob");
      staff.add("Carl");

      // or
      List<String> staff = new LinkedList<>(Arrays.asList("Amy", "Bob", "Carl"));

      ListIterator<String> iter = staff.listIterator();
      iter.next();
      iter.add("Juliet");
      while (iter.hasNext()) {
        System.out.println(iter.next());
      }
    ```


- `Queue`
  - `PriorityQueue`: `Object[]` 数组实现的小顶堆
    - 非线程安全，且不支持存储 `NULL` 和 `non-comparable` 对象。
    - 可以接收一个 `Comparator` 作为构造参数自定义元素优先级的先后。


    ```java
      PriorityQueue<LocalDate> pq = new PriorityQueue<>();
    
    ```

  - `DelayQueue`: `PriorityQueue`

  - `ArrayDeque`: 可扩容动态双向数组。
    - 线程不安全。
    - 不支持 `null` 值。
    - 双端队列的数组实现。

    ```java
      ArrayDeque<Integer> deque = new ArrayDeque<>(Arrays.asList(2, 4, 6));

      // 返回并删除队首元素
      // 为空抛出 NoSuchElementException
      deque.remove();
      // 为空返回null
      deque.poll();

      // 返回但不删除队首元素
      // 为空抛出 NoSuchElementException
      deque.element();
      // 为空返回null
      deque.peek();

    
    ```


### Map

- `HashMap`: JDK1.8 之前 `HashMap` 由数组+链表组成的，数组是 `HashMap` 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）。JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间。
  - 非线程安全， ConcurrentHashMap
  - 使用键（Key）计算 `hashcode`
  

  ```java
    Map<String,String> user = new HashMap<>();
    user.put("<key>","value");
    e = user.get("<key>");
    user.getOrDefault("1", "");
    for (Map.Entry<String, String> entry : user.entrySet()) {
      String k = entry.getKey();
      String v = entry.getValue();
      System.out.println("key: " + k + " value: " + v);
    }

    // or
    user.forEach((k, v) -> {
      System.out.println("key: " + k + " value: " + v);
    })
  ```


- `LinkedHashMap`: `LinkedHashMap` 继承自 `HashMap`，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，`LinkedHashMap` 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。

  //! TODO
  ```java

  ```

- `Hashtable`: 数组+链表组成的，数组是 `Hashtable` 的主体，链表则是主要为了解决哈希冲突而存在的。

- `TreeMap`: 红黑树（自平衡的排序二叉树）。