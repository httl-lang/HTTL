# HTTL for Visual Studio Code

[HTTL for VS Code](https://marketplace.visualstudio.com/items?itemName=HTTL.httl-vscode) brings powerful language support for the [HTTL programming language](https://httl.dev/), making it easy to write, execute, and test HTTP requests directly within VS Code.

## What is HTTL?

If you search for an "HTTP programming language," you'll likely be told that HTTP is just a protocol, not a language. But why isn’t there a dedicated language for writing HTTP requests?

Think of how SQL allows structured data retrieval or how Terraform enables infrastructure as code. **HTTL does the same for HTTP requests and API testing.**

### Why HTTL?

- **Intuitive and easy to learn** – Simple syntax designed for API workflows.
- **Intelligent OpenAPI support** – Get smart IntelliSense suggestions.
- **Reusable requests** – Save responses as variables for use in headers, bodies, and follow-up requests.
- **Built-in test scenarios** – Write and run API tests natively, without mixing in JavaScript or Python.

🚀 **Meet HTTL – The first HTTP programming language!** 🎉

With HTTL, you can replace UI-based tools like Postman or Insomnia with a powerful, code-first experience in VS Code.

## Quick Start

### 1. Install HTTL for VS Code

[Get the extension](https://marketplace.visualstudio.com/items?itemName=HTTL.httl-vscode) from the VS Code Marketplace.

### 2. Open or create an `.httl` file

The extension activates automatically when you open an `.httl` file.

### 3. Write and run your first request

```bash
get httl.dev/api/users
```

Press **F5** or **Ctrl | Cmd + Enter** to execute.

<p align="center">
<img src="docs/images/httl-file-demo.gif" width=75%>
<br/>
<em>(HTTL file)</em>
</p>


### 4. Use Quick Run (Optional)

If you don’t want to create a file, open the **Quick Run** panel to execute one-off requests.

> **Note:** Some features, like IntelliSense and formatting, are not available in Quick Run.
   
<p align="center">
<img src="docs/images/quick-run.gif" width=75%>
<br/>
<em>(Quick Run)</em>
</p>

## Learn More

Check out the [HTTL Documentation](https://httl.dev/docs) for full language details and advanced features.

## License

[View License](./LICENSE.md)

Happy coding! 🎉