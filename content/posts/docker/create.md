---
date: 2022-10-29T22:31:14+08:00
slug: /docker/create
tags:
  - docker
  - go
title: 从零开始实现一个可用的 docker
summary: 通过使用 go 实现一个可用的 docker 来了解 docker 的工作原理。
---
## basic

- 初始化
- 创建容器 id
- 下载 image
- 创建容器工作目录
- 挂载文件 overlay 方式
- 创建 veth pair
- 创建 netns
- 挂载 veth

## 支持的命令

- run
- child-mode
- setup-netns
- setup-veth
- ps
- exec
- images
- rmi

### container (overlay fs)

容器的工作目录

- /var/run/container/containers/containerId/fs
- /var/run/container/containers/containerId/fs/mnt
- /var/run/container/containers/containerId/fs/upperdir
- /var/run/container/containers/containerId/fs/workdir

## mount overlay file system

```bash
unix.mount()

```

## veth-pair

虚拟网络设备对,用于解决不同网络命名空间之间的通信

```go
func setupVirtualEthOnHost(containerID string) error {
	veth0 := "veth0_" + containerID[:6]
	veth1 := "veth1_" + containerID[:6]
	linkAttrs := netlink.NewLinkAttrs()
	linkAttrs.Name = veth0
	veth0Struct := &netlink.Veth{
		LinkAttrs:        linkAttrs,
		PeerName:         veth1,
		PeerHardwareAddr: createMACAddress(),
	}
	if err := netlink.LinkAdd(veth0Struct); err != nil {
		return err
	}
	netlink.LinkSetUp(veth0Struct)
	containerBridge, _ := netlink.LinkByName("container0")
	netlink.LinkSetMaster(veth0Struct, containerBridge)

	return nil
}
```
