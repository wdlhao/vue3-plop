

# 前端工程化-使用 plop 生成项目模板文件

## 概述

- 认识：
  [plop](https://plopjs.com/documentation/#getting-started) 是一个微型生成器框架，用于生成符合团队规范的模板文件。它是  [inquirer](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FSBoudrias%2FInquirer.js%2F)对话框 和  [hanldebar](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fhandlebars-lang%2Fhandlebars.js)模版的简单融合。

- 作用：
  通过自动化工具减少开发中重复代码的书写，从而提高开发效率；

- 优点：
  通过命令快速生成代码文件，免去了在项目中的新建文件、复制、粘贴等重复工作。

- 细节：
  plop.js 的终端交互使用了[Inquirer.js](https://github.com/SBoudrias/Inquirer.js/#question)，所以也可以使用 inquirer 的插件对其功能进行扩展。

- 应用场景：
  日常开发中经常会需要重复创建相同类型的文件，例如每一个 view 页面都会有三个文件(index.vue，index.scss，interface.ts)去组成。如果需要创建一个 view，就要去创建三个文件，并且每一个文件中都要有一些基础代码，这就比较繁琐，而且很难统一每一个文件中基础的代码。Plop 就可以解决这个问题，你只需要通过命令，就可以快速生成 view 模板文件。

## 使用方法

1. 安装插件

```js
pnpm i plop -D
// pnpm install -g plop
```

2. 创建配置文件 plopfile.js

在项目跟目录下，创建配置文件 plopfile.js，内容如下：

```js
const viewGenerator = require('./plop-templates/view/prompt')

module.exports = (plop) => {
  plop.setGenerator('view', viewGenerator)
}
```

plopfile.js 中导出一个函数，该函数接受 plop 对象作为它的第一个参数；plop 对象公开包含 setGenerator(name, config)函数的 plop api 对象。

3. 新建模板和脚本命令文件

在项目根目录下新建文件夹(如**plop-templates**)，放置模板(**view/index.vue**)和脚本命令(**view/prompt.js**)文件;

目录结构如图：

![image](https://github.com/wdlhao/vue3-plop/src/assets/imgs/directory.png)

view/index.vue 模板如下：

```js
<template>
    <div class="{{name}}Container"></div>
</template>

<script setup lang="ts" name="{{name}}">
    import { getCurrentInstance, ref, reactive, onMounted } from "vue";
    import { useRouter } from "vue-router";

    const {
        proxy: { $Urls, $Request, $Modal }
    } = getCurrentInstance() as any;

    const router = useRouter();

    defineExpose({});

    onMounted(() => {

    });
</script>

<style lang="scss" scoped>
    @import "./index.scss";
</style>
```

> 提示：这里的模板内容，大家可以根据自己的项目需求，进行自定义设置 ，主要目的是方便项目整体复用。

view/index.scss 模板如下：

```
.{{name}}Container{ }
```

router/index.vue 模板如下：

```
{
    path: "/{{name}}",
    name: "{{name}}",
    component: () => import("@/views/{{name}}/index.vue"),
    meta: {
         title: '{{menu}}'
    }
 },
```

view/prompt.js 脚本命名如下：

```js
module.exports = {
  description: '新建一个页面',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '页面名称:',
      validate(name) {
        if (!name) {
          return '请输入页面名称'
        }
        return true
      },
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: '需要包含什么:',
      choices: [
        {
          name: '<template>',
          value: 'template',
          checked: true,
        },
        {
          name: '<script>',
          value: 'script',
          checked: true,
        },
        {
          name: '<style>',
          value: 'style',
          checked: true,
        },
      ],
      validate(value) {
        if (!value.includes('template') || !value.includes('script') || !value.includes('style')) {
          return '<template>|<script>|<style> 是必须的'
        }
        return true
      },
    },
    {
      type: 'confirm',
      name: 'wantCps',
      message: '你想要给新页面添加组件吗?',
    },
    {
      type: 'input',
      name: 'cpsName',
      message: '组件名称:',
      when: function (answer) {
        // 当wantCps为true的时候才会到达这步
        return answer.wantCps // 只有我return true才会这个confirm
      },
      validate(name) {
        if (!name) {
          return '请输入组件名称'
        }
        return true
      },
    },
    {
      type: 'confirm',
      name: 'wantRouter',
      message: '你想要给新页面添加路由吗?',
    },
    {
      type: 'input',
      name: 'menu',
      message: '左侧菜单名称:',
      when: function (answer) {
        return answer.wantRouter
      },
      validate(name) {
        if (!name) {
          return '请输入菜单名称'
        }
        return true
      },
    },
  ],
  actions: (data) => {
    const name = '{{camelCase name}}'
    let actions = [
      {
        type: 'add',
        path: `src/views/${name}/index.vue`,
        templateFile: 'plop-templates/view/index.vue',
      },
      {
        type: 'add',
        path: `src/views/${name}/index.scss`,
        templateFile: 'plop-templates/view/index.scss',
      },
      {
        type: 'add',
        path: `src/views/${name}/interface.ts`,
      },
    ]

    let cpsName = '{{properCase cpsName}}'
    const cpsItem = [
      {
        type: 'add',
        path: `src/views/${name}/components/${cpsName}/index.vue`,
        templateFile: 'plop-templates/view/components/index.cps.vue',
      },
      {
        type: 'add',
        path: `src/views/${name}/components/${cpsName}/index.scss`,
        templateFile: 'plop-templates/view/components/index.cps.scss',
      },
    ]

    const routerItem = [
      {
        type: 'append',
        pattern: /routes*\:* \[/,
        path: 'src/router/index.ts',
        templateFile: 'plop-templates/router/index.vue',
        data: {
          name: '{{name}}',
          menu: '{{menu}}',
        },
      },
    ]

    if (data.wantCps && data.wantRouter) {
      return [...actions, ...cpsItem, ...routerItem]
    } else if (data.wantCps) {
      return [...actions, ...cpsItem]
    } else if (data.wantRouter) {
      return [...actions, ...routerItem]
    }
    return actions
  },
}
```

4. 设置自定义命令

在 package.json 添加 script 脚本

```js
{
  "scripts": {
    "plop": "plop"
  },
}
```

5. 运行命令

```js
pnpm run plop view
```

## 操作方法和文件生成

输入命令 pnpm run plop view

![image.png](/images/plop/plopView.png)

生成文件如下：

![image.png](/images/plop/file.png)

dataScreen/index.vue 模板内容如下：

![image.png](/images/plop/dataScreenTel.png)

dataScreen/index.scss 模板样式如下：

![image.png](/images/plop/dataScreenCss.png)

router/index.ts 路由内容如下：

![image.png](/images/plop/routerTel.png)

## Plofile API

plopfile api 是由 plop 对象公开的方法的集合，大部分工作都是由 setGenerator 完成的，当然也有很多其他有用的方法 。

**主要方法**

这些是创建 plopfile 时通常使用的方法。

| Method                                                        | Parameters                    | Returns       | Description                                           |
| ------------------------------------------------------------- | ----------------------------- | ------------- | ----------------------------------------------------- |
| [setGenerator](https://github.com/plopjs/plop#setgenerator)   | String, GeneratorConfig       | PlopGenerator | 设定一个生成器                                        |
| [setHelper](https://github.com/plopjs/plop#sethelper)         | String, Function              |               | 设定一个辅助方法                                      |
| [setPartial](https://github.com/plopjs/plop#setpartial)       | String, String                |               | 设定一个片段                                          |
| [setActionType](https://github.com/plopjs/plop#setactiontype) | String, CustomAction          |               | 注册一个自定义动作类型                                |
| [setPrompt](https://github.com/plopjs/plop#setprompt)         | String, InquirerPrompt        |               | 注册一个自定义的提示器类型                            |
| [load](https://github.com/plopjs/plop/blob/main/plop-load.md) | Array[String], Object, Object |               | 从另一个 plopfile 或 npm 模块加载生成器、辅助类或片段 |

### setGenerator

配置对象中 prompts 和 actions 属性，是必须的；description 属性是可选的；prompts 数组会被传递给 inquirer。而 actions 数组是要执行的操作列表。

示例如下：

```js
module.exports = function (plop) {
  // 创建一个生成器
  plop.setGenerator('component', {
    description: '新增一个公共组件', //可选；描述，在终端里生成器后面显示的内容
    prompts: [], // 提示，用于捕获用户输入
    actions: [], // 行为，具体执行的内容
  })
}
```

**GeneratorConfig 接口**

| Property    | Type                    | Default | Description          |
| ----------- | ----------------------- | ------- | -------------------- |
| description | [String]                |         | 简短说明生成器的用途 |
| prompts     | Array[InquirerQuestion] |         | 向用户提的问题       |
| actions     | Array[ActionConfig]     |         | 可执行的动作         |

### setHelper

setHelper 主要用于自定义相应一个工具方法，setHelper 直接对应于 handlebars 方法 registerHelper。

示例如下：

```js
module.exports = function (plop) {
  plop.setHelper('upperCase', function (text) {
    return text.toUpperCase()
  })
  // or in es6/es2015
  plop.setHelper('upperCase', (txt) => txt.toUpperCase())
}
```

### setPartial

setPartial 直接对应于 handlebars 的方法方法 registerPartial。

```js
module.exports = function (plop) {
  plop.setPartial('myTitlePartial', '<h1>{{titleCase name}}</h1>')
  // used in template as {{> myTitlePartial }}
}
```

### 其他方法

其他的方法，如 setPartial、setActionType、setPrompt、load 等等，具体用法，大家可以参见[官网](https://github.com/plopjs/plop)介绍；

## Plop Api

plop 最基本和最核心的内容：prompts 和 actions

### prompts

prompts 即是  [inquirer](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FSBoudrias%2FInquirer.js%2F)的 prompts，更多配置可参考[inquirer](https://github.com/SBoudrias/Inquirer.js)文档。

> 提示：prompts 数组里的 type 类型：input， number, confirm, list, rawlist, expand, checkbox, password, editor。当然也是支持 inquirer 插件的。

### actions

actions 函数配置属性包含：

#### name

认识：name 用于生成文件或文件夹的名称；

name 命名规则如下：

1. camelCase：将字符串转为驼峰表示法,一般应用于文件夹命名。示例：（changeFormatToThis）
2. properCase/pascalCase：单词首字母大写表示法，一般应用于组件文件夹命名。示例：（ChangeFormatToThis）
3. lowerCase ：小写表示法 （change format to this）
4. snakeCase：下划线表示法(change_format_to_this)
5. dashCase/kebaCase：短划线表示法(change-format-to-this)
6. dotCase：点语法表示法（change.format.to.this）
7. pathCase：路径表示法（change/format/to/this）
8. sentenceCase: 整句首字母大写法（Change format to this）
9. constantCase: 全部大写下划线连接 （CHANGE_FORMAT_TO_THIS）
10. titleCase ：标题表示法 （Change Format To This）

#### ActionConfig

属性如下：

| Property    | Type            | Default | Description                                                                                                                                                                                                                                                                                                                                        |
| ----------- | --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type        | String          |         | action 的类型(包括 [add](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fplopjs%2Fplop%23add), [modify](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fplopjs%2Fplop%23modify), [addMany](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fplopjs%2Fplop%23addmany),[Append](https://plopjs.com/documentation/#append)) |
| force       | Boolean         | false   | [强制执行](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fplopjs%2Fplop%23running-a-generator-forcefully)(不同的 action 类型会对应不同的逻辑)                                                                                                                                                                                            |
| data        | Object/Function | {}      | 指定 action 被执行时需要混入 prompts 答案的数据                                                                                                                                                                                                                                                                                                    |
| abortOnFail | Boolean         | true    | 当一个 action 由于某种原因执行失败时停止执行之后的所有 action                                                                                                                                                                                                                                                                                      |
| skip        | Function        |         | 一个用于指定当前 action 是否需要被执行的函数                                                                                                                                                                                                                                                                                                       |

> 提示：在 ActionConfig 里面，data 属性可以是一个返回普通对象的函数；也可以是一个返回 Promise 对象的函数，但这个 Promise 对象必须 resolve 一个对象 。

**内置动作**

您可以在 GeneratorConfig 中使用几种类型的内置动作。您可以指定操作的类型(所有路径都基于 plopfile 的位置)和要使用的模板 。

##### Add

add 动作被用来向你的项目中新增一个文件；

相关属性如下：

| Property     | Type     | Default | Description                                                                            |
| ------------ | -------- | ------- | -------------------------------------------------------------------------------------- |
| path         | String   |         | 指定生成文件的路径。它本身是一个 handlebars 模板，用户输入的文件名称将作为变量嵌入其中 |
| template     | String   |         | 被用来创建新文件的 handlebars 模板                                                     |
| templateFile | String   |         | 一个包含模板的文件路径                                                                 |
| skipIfExists | Boolean  | false   | 如果要创建的文件已经存在，则跳过（而非报错）                                           |
| transform    | Function |         | 一个可选函数，可用于在将文件写入磁盘之前转换模板结果                                   |
| skip         | Function |         | 继承自 ActionConfig                                                                    |
| force        | Boolean  | false   | 继承自 ActionConfig（如果文件存在则覆盖）                                              |
| data         | Object   | {}      | 继承自 ActionConfig                                                                    |
| abortOnFail  | Boolean  | true    | 继承自 ActionConfig                                                                    |

##### AddMany

addMany 动作可以一次创建多个文件。

细节：如果您希望添加的文件名是唯一的,则 templateFiles glob 位于的路径可以在它们的文件或文件夹名称中使用 handlebars 语法。

相关属性如下：

| Property        | Type     | Default | Description                                                                                 |
| --------------- | -------- | ------- | ------------------------------------------------------------------------------------------- |
| destination     | String   |         | 规定新文件要创建到的目录,它是一个 handlebars 模板，意味着该属性中定义的目录路径可以是动态的 |
| base            | String   |         | 将文件添加到目标文件夹时，可以排除模板路径的哪些部分                                        |
| templateFiles   | Glob     |         | 匹配要添加的多个模板文件的 glob 模式                                                        |
| stripExtensions | [String] | ['hbs'] | 应从 template 中剥离的文件扩展名在添加到目标时文件名                                        |
| globOptions     | Object   |         | 更改与要添加的模板文件匹配方式的 glob 选项                                                  |
| verbose         | Boolean  | true    | 打印每个成功添加的文件路径                                                                  |
| transform       | Function |         | 一个可选函数，可用于在将文件写入磁盘之前转换模板结果                                        |
| skip            | Function |         | 继承自 ActionConfig                                                                         |
| skipIfExists    | Boolean  | false   | 继承自 add(如果文件存在，则跳过)                                                            |
| force           | Boolean  | false   | 继承自 ActionConfig（如果文件存在则覆盖）                                                   |
| data            | Object   | {}      | 继承自 ActionConfig                                                                         |
| abortOnFail     | Boolean  | true    | 继承自 ActionConfig                                                                         |

##### Modify

modify 修改动作将使用 pattern 属性进行匹配，从而修改或替换指定路径(path)下的文件。

| Property     | Type     | Default     | Description                                                       |
| ------------ | -------- | ----------- | ----------------------------------------------------------------- |
| path         | String   |             | 要修改的文件的路径（是一个 handlebars 模板）                      |
| pattern      | RegExp   | end‑of‑file | 一个正则表达式，用来匹配需要被替换的文本                          |
| template     | String   |             | 一个 handlebars 模板，用它取代所匹配的模式。捕获组的值有$1、$2 等 |
| templateFile | String   |             | 是一个包含模板的路径                                              |
| transform    | Function |             | 一个可选函数，可用于在将文件写入磁盘之前转换模板结果              |
| skip         | Function |             | 继承自 ActionConfig                                               |
| data         | Object   | {}          | 继承自 ActionConfig                                               |
| abortOnFail  | Boolean  | true        | 继承自 ActionConfig                                               |

##### Append

append  追加操作是一个常用功能，它是 modify 接口的子集。它用于将数据追加到文件中的特定位置。

| Property     | Type           | Default  | Description                                    |
| ------------ | -------------- | -------- | ---------------------------------------------- |
| path         | String         |          | 需要被修改的文件路径（是一个 handlebars 模板） |
| pattern      | RegExp, String |          | 一个正则表达式，用于匹配附加文本的正则表达式   |
| unique       | Boolean        | true     | 是否删除相同的项                               |
| separator    | String         | new line | 分割符                                         |
| template     | String         |          | 用于入口的 handlebars 模板                     |
| templateFile | String         |          | 是一个包含模板的路径                           |
| data         | Object         | {}       | 继承自 ActionConfig                            |
| abortOnFail  | Boolean        | true     | 继承自 ActionConfig                            |

### 动态 actions

如果 actions 需要根据 prompts 的 answer 来决定，那么可以使用动态 actions

示例如下：

```js
module.exports = function (plop) {
    plop.setGenerator('test', {
        prompts: [{
            type: 'confirm',
            name: 'wantTacos',
            message: 'Do you want tacos?'
        }],
        actions: function(data) {
            var actions = [];

            if(data.wantTacos) {
                actions.push({
                    type: 'add',
                    path: 'folder/{{dashCase name}}.txt',
                    templateFile: 'templates/tacos.txt'
                });
            } else {
                actions.push({
                    type: 'add',
                    path: 'folder/{{dashCase name}}.txt',
                    templateFile: 'templates/burritos.txt'
                });
            }

            return actions;
        }
    });
```

## 源码地址

- [本项目(vue3-plop)源码地址](https://github.com/wdlhao/vue3-plop)

## 参考资料

1. [plopjs ](https://plopjs.com/documentation/#getting-started)
2. [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#objects)
3. [handlebarsjs](https://handlebarsjs.com/guide/expressions.html)
