---
description: Commit and push — commit name format "promptN testM"
---

Commit and push all changes. Commit message format: "prompt{N} test{M}".

Examples:
- User says "промт 10 попытка 2" → commit message: "prompt10 test2"
- User says "prompt 5 test 1" → commit message: "prompt5 test1"
- User says "/git-push 10 2" → commit message: "prompt10 test2"

Steps:

1. Ask the user: "Укажи номер промта и попытку (например: 10 2)"
   If the user already provided numbers in the slash command arguments, use those directly.

// turbo
2. Run in WSL: git -C /home/ubuntu/prob/buisnes-page/beauty-platform add -A

3. Run in WSL: git -C /home/ubuntu/prob/buisnes-page/beauty-platform commit -m "prompt{N} test{M}"
   (substitute actual N and M values from step 1)

// turbo
4. Run in WSL: git -C /home/ubuntu/prob/buisnes-page/beauty-platform push

5. Show the output to the user and confirm success.
