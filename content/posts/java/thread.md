---
date: 2023-11-16T05:25:33Z
toc: true
slug: /java/thread
tags:
  - Java
title: thread
draft: true
---


## 并发


### 锁 synchronized

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

}

```