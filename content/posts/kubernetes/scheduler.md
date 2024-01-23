---
date: 2023-02-24T15:46:14+08:00
slug: /kubernetes/scheduler
tags:
  - kubernetes
  - scheduler
title: kubernetes scheduler
summary: kubernetes scheduler
---
## 调度器配置
你可以通过编写配置文件，并将其路径传给 kube-scheduler 的命令行参数，定制 kube-scheduler 的行为。

调度模板（Profile）允许你配置 kube-scheduler 中的不同调度阶段。每个阶段都暴露于某个扩展点中。插件通过实现一个或多个扩展点来提供调度行为。

你可以通过运行 kube-scheduler --config <filename> 来设置调度模板， 使用 KubeSchedulerConfiguration（v1beta3 或 v1）结构体。

```yml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
说明：
```


### 配置文件
调度行为发生在一系列阶段中，这些阶段是通过以下扩展点公开的：

#### 扩展点

- queueSort：这些插件对调度队列中的悬决的 Pod 排序。 一次只能启用一个队列排序插件。
- preFilter：这些插件用于在过滤之前预处理或检查 Pod 或集群的信息。 它们可以将 Pod 标记为不可调度。
- filter：这些插件相当于调度策略中的断言（Predicates），用于过滤不能运行 Pod 的节点。 过滤器的调用顺序是可配置的。 如果没有一个节点通过所有过滤器的筛选，Pod 将会被标记为不可调度。
- postFilter：当无法为 Pod 找到可用节点时，按照这些插件的配置顺序调用他们。 如果任何 postFilter 插件将 Pod 标记为可调度，则不会调用其余插件。
- preScore：这是一个信息扩展点，可用于预打分工作。
- score：这些插件给通过筛选阶段的节点打分。调度器会选择得分最高的节点。
- reserve：这是一个信息扩展点，当资源已经预留给 Pod 时，会通知插件。 这些插件还实现了 Unreserve 接口，在 Reserve 期间或之后出现故障时调用。
- permit：这些插件可以阻止或延迟 Pod 绑定。
- preBind：这些插件在 Pod 绑定节点之前执行。
- bind：这个插件将 Pod 与节点绑定。bind 插件是按顺序调用的，只要有一个插件完成了绑定，其余插件都会跳过。bind 插件至少需要一个。
- postBind：这是一个信息扩展点，在 Pod 绑定了节点之后调用。
- multiPoint：这是一个仅配置字段，允许同时为所有适用的扩展点启用或禁用插件

## 调度策略

调度器通过 Kubernetes 的监测（Watch）机制来发现集群中新创建且尚未被调度到节点上的 Pod。 调度器会将所发现的每一个未调度的 Pod 调度到一个合适的节点上来运行。 调度器会依据下文的调度原则来做出调度选择。

### 调度流程
- 过滤
- 打分