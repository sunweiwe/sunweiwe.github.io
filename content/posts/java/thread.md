---
date: 2023-11-16T05:25:33Z
slug: /java/thread
tags:
  - Java
title: thread
draft: false
summary: Java thread 相关知识点
---
## 并发


### 线程

#### 线程状态
 - New
 - Runnable
 - Blocked
 - Waiting
 - Timed waiting
 - Terminated


### synchronized

- 可重入


```java

public class Bank{
  private Lock lock = new ReentrantLock();
  private Condition sufficientFunds;

  public Bank(){
    sufficientFunds = lock.newCondition();
  }

  
  public void transfer(int from, int amount){
    lock.lock();// a ReentrantLock object
    try{
      // critical section
      while(accounts[form] < amount){
        // 挂起线程，释放锁
        sufficientFunds.await();
      }
      sufficientFunds.signalAll();
      
    }finally{
      lock.unlock();
    }
  }

  // OR
  public synchronized void syncTransfer(int from,int amount) throw InterruptedException
  {
    while(accounts[from] < amount)
      wait();
    accounts[from] -= amount;
    accounts[to] += amount;
    notifyAll();
  }

}

```


### volatile 和 final
 - 保证数据的可见性，但不保证数据的原子性。
 - 防止JVM的指令重排。插入特定的 内存屏障的方式禁止指令重排序。

```java
public native void loadFence();
public native void storeFence();
public native void fullFence();
```




### 原子性

- AtomicIntegerFieldupdater 原子更新整型字段的更新器
- AtmoicLongFieldUpdater 原子更新长整型字段的更新器
- AtmoicReferenceFieldUpdater 原子更新引用类型里的字段

```java
public static AtmoicLong nextNumber = new AtomicLong();

long id = nextNumber.incrementAndGet();

```


### 锁

```java
private ReentrantReadWriteLock rw = new ReentrantReadWriterLock();

private Lock readLock = rw.readLock();
private Lock writeLock = rw.writeLock();

public doube getTotalBalance()
{
  readLock.lock();
  try{

  }finally{
    readLock.unlock();
  }
}

public void transfer(){
  writeLock.lock();
  try{

  }finally{
    writeLock.unlock();
  }
}

```


### 线程安全的集合

- ConcurrentHashMap
- ConcurrentSkipListMap
- ConcurrentSkipListSet
- ConcurrentLinkedQueue

### 执行器

- newCachedThreadPool
- newFiexdThreadPool
- newSingleThreadExcutor
- newScheduledThreadPool
- newSingleThreadScheduledExcutor