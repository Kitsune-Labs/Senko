---
name: New Shop Item
about: I want to add <thing> to the shop!
title: ''
labels: Shop Addition
assignees: ''

---

## What item do you want added?
A description of what you want added


## Fill this in with the details
```jsonc
"name_id": {
    "class": "profile|food|material|general",
    "name": "Detailed Item Name",
    "desc": "Item Description?",
    "price": 200,
    "amount": 1, // How much should you get per-purchase
    "onsale": false,
    "max": 1, // What is the maximum amount you can have
    "title|badge|color|banner": "value",
}
```
