---
date: 2023-11-15T19:50:55+08:00
toc: true
slug: /java/stream
tags:
  - Java
  - Stream
title: stream
draft: true
---

## 从迭代到流的操作

```java

var contents = new String(Files.readAllBytes(
  Paths.get("alice.txt")),StandardCharsets.UTF_8);

List<String> words = List.of(contents.split("\\PL+"));

int count = 0;
for (String w : words){
  if (w.length()>12) count++;
}

long count = words.parallelStream().filter(w -> w.length() >12 ).count();

```