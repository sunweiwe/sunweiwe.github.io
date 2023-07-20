---
date: 2022-05-22T15:21:13+08:00
slug: /pprof/basic
tags:
  - Go
  - pprof
title: pprof
---

<!--abstract-->

pprof 工具可以用来监测进程的运行数据，用于监控程序的性能，对内存使用和 CPU 使用的情况统信息进行分析。

<!--more-->

## pprof 是什么？

pprof 工具可以用来监测进程的运行数据，用于监控程序的性能，对内存使用和 CPU 使用的情况统信息进行分析。

## 采样方式

- runtime/pprof：采集程序（非 Server）的指定区块的运行数据进行分析。
- net/http/pprof：基于 HTTP Server 运行，并且可以采集运行时数据进行分析。
- go test：通过运行测试用例，并指定所需标识来进行采集。

## 使用模式

- Report generation：报告生成。
- Interactive terminal use：交互式终端使用。
  (go tool pprof http://localhost:6060/debug/pprof/profile/(allocs|blocks|goroutine|etc..))
  - top
  - list
  - web
- Web interface：Web 界面。

## 使用方式

```go
package main

import (
	// 略
	_ "net/http/pprof" // 会自动注册 handler 到 http server，方便通过 http 接口获取程序运行采样报告
	// 略
)

func main() {
	// 略

	runtime.GOMAXPROCS(1) // 限制 CPU 使用数，避免过载
	runtime.SetMutexProfileFraction(1) // 开启对锁调用的跟踪
	runtime.SetBlockProfileRate(1) // 开启对阻塞操作的跟踪

	go func() {
		// 启动一个 http server，注意 pprof 相关的 handler 已经自动注册过了
		if err := http.ListenAndServe(":6060", nil); err != nil {
			log.Fatal(err)
		}
		os.Exit(0)
	}()
}

```

## 采集数据类型

- allocs 内存分配情况的采样信息
- blocks 阻塞操作情况的采样信息
- cmdline 显示程序启动命令及参数
- goroutine 当前所有协程的堆栈信息
- heap 堆上内存使用情况的采样信息
- mutex 锁争用情况的采样信息
- profile CPU 占用情况的采样信息
- threadcreate 系统线程创建情况的采样信息
- trace 程序运行跟踪信
