---
title: 2025-04-10 Managing Resume And Auto-generation
slug: 2025/managing-resume-and-auto-generation
tags:
- '2025-04'
- '2025'
- 'md2pdf'
- 'resume'
- 'automation'
hide_table_of_contents: false
---
I recently updated my resume, which involved the usual process:
- Searching for achievements to add (I record these as they happen in Notion and a GitHub repo)
- Locating the previous Google Doc containing my resume
- Making in-place updates to that doc and spending a frustrating amount of time getting the indentation and spacing right in Google Docs<!-- truncate -->
- Downloading the document as a PDF and uploading it to Google Drive (I couldn't find a "Save as PDF" option in Google Docs to automatically save it to Drive)

This process requires a significant amount of data gathering and copying/pasting. I had the idea of managing my resume as a blog post on this blog, which is entirely written in Markdown. This would allow me to have everything in Markdown, tracked by Git, and stored on GitHub. I thought of storing everything solely on GitHub (instead of Notion and Google Docs) as Markdown and writing a Markdown processor to convert it to PDF (since we'll likely need PDFs for the foreseeable future).

Fortunately, I don't use much styling in my resume; it's mostly just simple text with bunch of heading, list items and a few horizontal lines. Since my use case wasn't that unique, I searched for existing tools, and `pandoc` stood out.

Pandoc seems complex to work with, especially with PDFs, and requires several extensions. This was initially a major barrier to entry, so I looked for simpler, purpose-built tools (Markdown to PDF only, as Pandoc is very general-purpose). However, none of them worked quite right or still required installing LaTeX or other extensions. In the end, I settled on Pandoc but didn't want to clutter my host with unnecessary extensions or libraries, so I decided to use a Docker-based setup.

## The Setup
At the time of writing, the `pandoc/latex:3` Docker image didn't have an ARM version available, but `pandoc/latex:3-ubuntu` did, so I opted for that one. Pandoc uses LaTeX by default for PDF conversion, and while you can pass in various parameters to control the styling, elements like headings, list items, etc., are more easily managed using HTML and CSS. And since I had a little experience with HTML and CSS (should add these to resume as well), I decided to use Pandoc's HTML processor for generating the PDF.

### The dockerfile
```Dockerfile
FROM pandoc/latex:3-ubuntu

WORKDIR /data

# required by html processor
RUN apt update && apt upgrade -y && apt install -y weasyprint

ENTRYPOINT ["pandoc"]

```

As I mentioned, my resume had a bunch of headings, list items, paragraphs, and some horizontal lines (everything written as Markdown text). I needed to control the styling of all these elements, and the output PDF needed to be formatted for A4 size paper. So, the CSS styling I ended up with was something like:

### The css file
```css
/* Base styles */
@page {
    size: A4;
    margin: 0.35in 0.35in 0.35in 0.45in;
}

body {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    line-height: 1.15;
    font-size: 10pt;
}

/* Headings */
h1 {
    margin: 0.2em 0 0.2em 0;
    font-size: 16pt;
}

h2 {
    margin: 0.8em 0 0.2em 0;
    font-size: 14pt;
}

li {
    margin: 0.15em 0;
    text-align: justify;
}

hr {
    border: none;
    height: 1px;
    background-color: #ddd;
    margin: 0.2em 0;
}

```

It all looked familiar, or at least was pretty easy to pick up, thanks to our AI lords.

And that was pretty much it. Now, assuming you have these files in a directory structured as follows:

```txt
├── resume.md    # File containing your resume
├── resume.css   # CSS styling for the PDF output
└── Dockerfile   # Docker configuration file
```

You can (or at least I did) generate that nice looking pdf with
```sh
docker build -t pandoc-md2pdf -f Dockerfile .
docker run --rm -v "$(pwd):/data" pandoc-md2pdf -t html -c ./resume.css ./resume.md -o ./resume.pdf
```

## The Future Ahead
While I may need to make some minor adjustments to the styling, I'm highly confident that this new workflow will replace my previous process involving Google Docs. Moving forward, I can simply update the markdown file with any new achievements I want to showcase on my resume. Then, by running that abocve `docker run` command, I'll have a nice-looking PDF generated automatically. And, of course, my resume will be updated on this blog as well.