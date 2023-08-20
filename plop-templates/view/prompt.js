module.exports = {
	description: "新建一个页面",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "页面名称:",
			validate(name) {
				if (!name) {
					return "请输入页面名称";
				}
				return true;
			}
		},
		{
			type: "checkbox",
			name: "blocks",
			message: "需要包含什么:",
			choices: [
				{
					name: "<template>",
					value: "template",
					checked: true
				},
				{
					name: "<script>",
					value: "script",
					checked: true
				},
				{
					name: "<style>",
					value: "style",
					checked: true
				}
			],
			validate(value) {
				if (!value.includes("template") || !value.includes("script") || !value.includes("style")) {
					return "<template>|<script>|<style> 是必须的";
				}
				return true;
			}
		},
		{
			type: "confirm",
			name: "wantCps",
			message: "你想要给新页面添加组件吗?"
		},
		{
			type: "input",
			name: "cpsName",
			message: "组件名称:",
			when: function (answer) {
				// 当wantCps为true的时候才会到达这步
				return answer.wantCps; // 只有我return true才会这个confirm
			},
			validate(name) {
				if (!name) {
					return "请输入组件名称";
				}
				return true;
			}
		},
		{
			type: "confirm",
			name: "wantRouter",
			message: "你想要给新页面添加路由吗?"
		},
		{
			type: "input",
			name: "menu",
			message: "左侧菜单名称:",
			when: function (answer) {
				return answer.wantRouter;
			},
			validate(name) {
				if (!name) {
					return "请输入菜单名称";
				}
				return true;
			}
		}
	],
	actions: data => {
		const name = "{{camelCase name}}";
		let actions = [
			{
				type: "add",
				path: `src/views/${name}/index.vue`,
				templateFile: "plop-templates/view/index.hbs"
			},
			{
				type: "add",
				path: `src/views/${name}/index.scss`,
				templateFile: "plop-templates/view/index.scss.hbs"
			},
			{
				type: "add",
				path: `src/views/${name}/interface.ts`
			}
		];

		let cpsName = "{{properCase cpsName}}";
		const cpsItem = [
			{
				type: "add",
				path: `src/views/${name}/components/${cpsName}/index.vue`,
				templateFile: "plop-templates/view/components/index.cps.hbs"
			},
			{
				type: "add",
				path: `src/views/${name}/components/${cpsName}/index.scss`,
				templateFile: "plop-templates/view/components/index.cps.scss.hbs"
			}
		];

		const routerItem = [
			{
				type: "append",
				pattern: /routes*\:* \[/,
				path: "src/router/index.ts",
				templateFile: "plop-templates/router/index.hbs",
				data: {
					name: "{{name}}",
					menu: "{{menu}}"
				}
			}
		];

		if (data.wantCps && data.wantRouter) {
			return [...actions, ...cpsItem, ...routerItem];
		} else if (data.wantCps) {
			return [...actions, ...cpsItem];
		} else if (data.wantRouter) {
			return [...actions, ...routerItem];
		}
		return actions;
	}
};
