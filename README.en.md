# Atelier (Workshop)

The development environment built into NeoDex: write web pages, JavaScript or Python scripts and NeoDex plugins, test them right away, and prepare a plugin's archive for publishing, without leaving the app.

*Version française : [README.md](README.md)*

## Projects

- The left column lists your **projects** and their files, with folders. Create, rename or delete a file; open several in tabs.
- **New project from a template** offers: Web page, JavaScript script, Python script, Empty project, and five plugin templates: hello (the smallest possible plugin), counter (which saves its data), canvas game (a 2D game loop that stops when the tab closes), home widget and notifications with an image.
- **Import** adds files from your PC to the project; you can also drag them onto the file list.

## The editor

- Highlighting for HTML, CSS, JavaScript, Python, JSON and Markdown, line numbers, automatic indentation, brackets and quotes closed for you.
- **Ctrl+F** finds and replaces in the file, **Ctrl+Shift+F** searches the whole project.
- **Ctrl+/** comments, **Ctrl+D** duplicates the line, **Alt+↑/↓** moves it, **Tab** indents.
- **Shift+Alt+F** formats the file (reformats JSON, removes extra spaces).
- **Ctrl+P** opens a file or runs a command by name; **Ctrl+=** and **Ctrl+-** change the text size.
- **Ctrl+S** saves.

## Running (▶ or Ctrl+Enter)

- **Web pages**: the preview updates as you type; linked CSS and JavaScript are read from the project.
- **Console**: it shows the preview's `console.log` output, errors and rejected promises, and a line lets you evaluate JavaScript.
- **JavaScript scripts**: they run in an isolated sandbox, 8 seconds at most, with `await` allowed.
- **Python scripts**: they run with the Python 3 installed on your PC, in a temporary folder where the whole project is copied, 10 seconds at most. Without Python, the Workshop explains how to install it (python.org, "Add to PATH" box).

## Making a plugin

1. Start from a "Plugin: …" template.
2. **▶** tests the plugin in an isolated frame, with a temporary in-memory data folder; the console shows its loading and its errors.
3. **Validate the plugin** checks `plugin.json` and the code, and lists what needs fixing.
4. **Export .zip** builds the archive to attach to a GitHub Release (topic `neodex-plugin`), with a generated icon if you have none.

Publishing itself (GitHub Release, signature and approval) happens outside the Workshop. The [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk) describes everything a plugin can do.

## Security

Your code never runs inside NeoDex itself: it is always isolated and sees neither your data nor your tabs. Only running Python goes through the Workshop's system part, which requires full access.

## Data and sync

Your projects are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Atelier → Install**.
