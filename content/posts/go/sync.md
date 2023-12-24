---
date: 2022-10-23T22:55:45+08:00

slug: /go/sync
tags:
  - go
title: sync
---

<!--abstract-->

go stand library 基本的知识

<!--more-->

# **Mutex**

互斥锁

## 互斥锁的实现

互斥锁是控制并发的基础手段。

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var counter Counter
	var wg sync.WaitGroup
	wg.Add(10)

	for i := 0; i < 10; i++ {
		go func() {
			defer wg.Done()
			for j := 0; j < 10000; j++ {
				counter.Lock()
				counter.Count++
				counter.Unlock()
			}
		}()
	}

	wg.Wait()
	fmt.Println(counter.Count)
}

type Counter struct {
	sync.Mutex
	Count uint64
}
```

# Pool

创建池化的对象

## sync.Pool

sync.Pool 数据类型用来保存一组可独立访问的临时对象。

- sync.Pool 本身线程安全，多个 goroutine 可以并发地调用它的方法存取对象。
- sync.Pool 不可在使用之后在复制使用。

## sync.Pool 的使用方法

### new

pool struct 包含一个 new 字段，这个字段的类型是函数 func() interface{}。当调用 get 方法从池中获取元素的时候，没有空闲的元素可返回时，便会调用 new 新建一个元素返回。

### get

调用此方法从池中取走一个元素。

### put

此方法将一个元素返还给 pool，pool 将这个元素保存到池中并且可以复用。

## buffer 缓冲池

```go
var buffers ={
	New: func() interface{}{
		return new(bytes.Buffer)
	},

}

func GetBuffer() *bytes.Buffer{
	return buffers.Get().(*bytes.Buffer)
}

func PutBuffer(buf *bytes.Buffer){
	buf.Reset()
	buffers.Put(buf)
}
```

## 实现原理

### Get 方法

```go
func (p *Pool) Get() interface{} {
	// 把当前 goroutine 固定在当前的p上
	l, pid := p.pin()
	x :=l.private  //优先从local 的 private字段取，快速
	l.private = nil
	if x == nil {
		x,_ := l.shared.popHead()
		if x == nil{
			x = p.getSlow(pid)
		}
	}

	runtime_procUnpin()
	// 如果没有获取到，尝试使用new函数生成一个新的
	if x = nil && p.New != nil {
		x = p.New()
	}

	return x
}
```

## 内存泄露

使用 sync.Pool 回收 buffer 的时候，一定要检查回收的对象的大小。
