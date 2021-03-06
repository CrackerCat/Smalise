# Change Log

## Version 0.0.4

### Special Thanks

Thanks for [@Gh0u1L5](https://github.com/Gh0u1L5) to pull this new vision!

### Features Added
* Go To/Peek References
* Rename Symbol

**WARNING:** The Goto/Peek References function will immediately load all smali files into memory and take 20X memory to parse and store the metadata, so please use the function with caution.

### Bugs Fixed
* The extension will misbehaviour if user creates/renames/deletes parsed files.
* The hover provider treats all capital letters as primitive types, e.g. letter "S" in "toString()" will be recognized as "short" type.
* For saved documents and unsaved documents, their `vscode.Uri` are slightly different. This will create two copies of the same class in `jclasses: Map<vscode.Uri, Class>`.
* `fs.readFileSync` only supports file operations on local disk, but VSCode's API are designed to be compatible with remote files (e.g. files online, files on a SSH server).
* Some other small issues that I don't really remember.