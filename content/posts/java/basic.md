---
date: 2023-11-14T03:37:48Z
slug: /java/basic
tags:
  - Java
title: basic
draft: false
summary: Spring boot注解基本用法
---
## 注解

### SpringBootApplication

```java
@SpringBootApplication 
public class SpringSecurityJwtGuideApplication {
      public static void main(java.lang.String[] args) {
        SpringApplication.run(SpringSecurityJwtGuideApplication.class, args);
    }
}

// 相当于 @ComponentScan @Configuration @EnableAutoConfiguration

package org.springframework.boot.autoconfigure;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
		@Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
   ......
}

package org.springframework.boot;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {

}

```
- @EnableAutoConfiguration：启用 SpringBoot 的自动配置机制
- @ComponentScan：扫描被@Component (@Repository,@Service,@Controller)注解的 bean，注解默认会扫描该类所在的包下所有的类。
- @Configuration：允许在 Spring 上下文中注册额外的 bean 或导入其他配置类


### Autowired
自动导入对象到类中，被注入进的类同样要被 Spring 容器管理比如：Service 类注入到 Controller 类中。

```java
@Service
public class UserService {
  ......
}

@RestController
@RequestMapping("/users")
public class UserController {
   @Autowired
   private UserService userService;
   ......
}

```

### Component Service Controller Repository

我们一般使用 @Autowired 注解让 Spring 容器帮我们自动装配 bean。要想把类标识成可用于 @Autowired 注解自动装配的 bean 的类,可以采用以下注解实现：

- @Component：通用的注解，可标注任意类为 Spring 组件。如果一个 Bean 不知道属于哪个层，可以使用@Component 注解标注。
- @Repository : 对应持久层即 Dao 层，主要用于数据库相关操作。
- @Service : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- @Controller : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 Service 层返回数据给前端页面。

### RestController

@RestController注解是@Controller和@ResponseBody的合集,表示这是个控制器 bean,并且是将函数的返回值直接填入 HTTP 响应体中,是 REST 风格的控制器。

### Scope

声明 Spring Bean 的作用域，使用方法:

```Java
@Bean
@Scope("singleton")
public Person personSingleton() {
    return new Person();
}
```
- singleton : 唯一 bean 实例，Spring 中的 bean 默认都是单例的。
- prototype : 每次请求都会创建一个新的 bean 实例。
- request : 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP request 内有效。
- session : 每一个 HTTP Session 会产生一个新的 bean，该 bean 仅在当前 HTTP session 内有效。


### Configuration

一般用来声明配置类，可以使用 @Component注解替代，不过使用@Configuration注解声明配置类更加语义化。

```java
@Configuration
public class AppConfig {
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }
}

```
### PathVariable 

@PathVariable用于获取路径参数，@RequestParam用于获取查询参数。

```java
@GetMapping("/user/{id}/teachers")
public List<Teacher> getKlassRelatedTeachers(
         @PathVariable("id") Long id,
         @RequestParam(value = "type", required = false) String type ) {
...
}

// 请求的 url 是：/user/123456/teachers?type=web
// 服务获取到的数据就是：id=123456,type=web
```

### Value

使用 @Value("${property}") 读取比较简单的配置信息：

```java
@Value("${wuhan2020}")
String wuhan2020;
```

### ConfigurationProperties

通过@ConfigurationProperties读取配置信息并与 bean 绑定。

```java
@Component
@ConfigurationProperties(prefix = "library")
class LibraryProperties {
    @NotEmpty
    private String location;
    private List<Book> books;

    @Setter
    @Getter
    @ToString
    static class Book {
        String name;
        String description;
    }
  // 省略getter/setter
}

```


### Transactional

在要开启事务的方法上使用@Transactional注解即可!

```java
@Transactional(rollbackFor = Exception.class)
public void save() {
  ......
}
```

- 作用于类：当把@Transactional 注解放在类上时，表示所有该类的 public 方法都配置相同的事务属性信息。
- 作用于方法：当类配置了@Transactional，方法也配置了@Transactional，方法的事务会覆盖类的事务配置信息。

#### 事务的特性（ACID）
- 原子性（Atomicity）：事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；
- 一致性（Consistency）：执行事务前后，数据保持一致，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；
- 隔离性（Isolation）：并发访问数据库时，一个用户的事务不被其他事务所干扰，各并发事务之间数据库是独立的；
- 持久性（Durability）：一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。



