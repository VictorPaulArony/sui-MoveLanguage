# 📘 Sui Move: Understanding Struct Abilities (`copy`, `drop`, `store`, `key`)

## 🧠 Introduction

In Sui Move, the `has` keyword is used to attach **abilities** to structs. These abilities define how structs behave in terms of memory management, copying, storage, and on-chain publication.

This guide explains the four core abilities:

* `copy`
* `drop`
* `store`
* `key`

Each ability is explained with simple code examples to demonstrate how and why it's used.

---

## 📦 1. `copy`: Enable Duplication of Struct Values

### ✅ Definition

```move
struct Point has copy, drop {
    x: u64,
    y: u64,
}
```

### 📌 Purpose

* Allows values of this struct to be **copied** (not just moved).
* Useful when a value needs to be used multiple times without consuming it.

### 💡 Example

```move
module example::point_example {
    use std::debug;

    struct Point has copy, drop {
        x: u64,
        y: u64,
    }

    public entry fun use_point() {
        let p1 = Point { x: 3, y: 4 };
        let p2 = p1; // Valid because Point has `copy`
        let p3 = p1;

        debug::print(&p1.x); // 3
        debug::print(&p2.y); // 4
        debug::print(&p3.x); // 3
    }
}
```

### 🚫 Without `copy`

You can’t use `p1` after assigning it to `p2` — Move will throw a compile-time error.

---

## 🗑 2. `drop`: Allow Safe Discarding of Values

### ✅ Definition

```move
struct Point has copy, drop {
    x: u64,
    y: u64,
}
```

### 📌 Purpose

* Allows the value to be **discarded silently** without being consumed.
* Prevents compiler errors when values go unused.

### 💡 Example

```move
module example::drop_example {
    use std::debug;

    struct Point has copy, drop {
        x: u64,
        y: u64,
    }

    public entry fun drop_point_example() {
        let _p = Point { x: 1, y: 2 };
        // No error, even though `_p` is not used, thanks to `drop`

        debug::print(&10);
    }
}
```

### 🚫 Without `drop`

Move will throw an error if `_p` is not explicitly used, moved, or destroyed.

---

## 🧱 3. `store`: Allow Structs to Be Stored in Global State

### ✅ Definition

```move
struct MyData has store {
    value: u64,
}
```

### 📌 Purpose

* Allows a struct to be **stored inside another struct** or **passed into global storage**.
* Required when used as a field inside objects (which are published on-chain).

### 💡 Example

```move
module example::store_example {
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::object;
    use sui::debug;

    struct MyData has store {
        value: u64,
    }

    struct Container has key, store {
        id: UID,
        data: MyData,
    }

    public entry fun create_container(ctx: &mut TxContext) {
        let id = object::new_uid(ctx);
        let data = MyData { value: 42 };
        let container = Container { id, data };

        object::publish(container);

        debug::print(&42);
    }
}
```

### 🚫 Without `store`

Move will throw an error when you try to store `MyData` inside `Container`.

---

## 🔑 4. `key`: Make the Struct a Global On-Chain Object

### ✅ Definition

```move
struct Coin has key, store {
    id: UID,
    value: u64,
}
```

### 📌 Purpose

* Marks the struct as a **Sui object** with a globally unique ID.
* Required for structs that are **published on-chain**.
* Must include a `UID` field.

### 🚨 Notes

* Must be used **with `store`**
* Only structs with `key` can be used as **independent Sui objects**

---

## 🧪 Final Example: Using All Four Abilities

### ✅ Definition

```move
struct ExampleStruct has copy, drop, key, store {
    id: UID,
    value: u64,
}
```

### 💡 Code

```move
module example::all_properties_example {
    use sui::object::{self, UID};
    use sui::tx_context::TxContext;
    use sui::debug;

    struct ExampleStruct has copy, drop, key, store {
        id: UID,
        value: u64,
    }

    public entry fun create_example(ctx: &mut TxContext) {
        let id = object::new_uid(ctx);
        let ex1 = ExampleStruct { id, value: 100 };
        object::publish(ex1);
    }

    public fun use_example_value(ex: ExampleStruct) {
        let ex_copy = ex;

        debug::print(&ex.value);
        debug::print(&ex_copy.value);

        // No need to manually destroy `ex` or `ex_copy` — `drop` allows it
    }
}
```

### 🔍 Breakdown

| Ability | Used For                                        |
| ------- | ----------------------------------------------- |
| `copy`  | Duplicate the struct for multiple reads         |
| `drop`  | Discard values safely without consuming them    |
| `store` | Store inside objects or publish to global state |
| `key`   | Make it a Sui on-chain object with a unique ID  |

---

## ✅ Summary Table

| Ability | Purpose                                               | Common Usage                         |
| ------- | ----------------------------------------------------- | ------------------------------------ |
| `copy`  | Enables value duplication                             | When struct contains only primitives |
| `drop`  | Allows discarding values without explicit destruction | For optional or temporary values     |
| `store` | Enables storage in global state or nested structs     | Required for persistence             |
| `key`   | Makes the struct a publishable Sui object             | Needed for on-chain objects          |
