#!/usr/bin/env python3
"""task-tracker - Lightweight multi-step task tracker

Usage:
  task-tracker.py new "<task>" "<step1|step2|step3>"
  task-tracker.py done "<task>" <step_number>
  task-tracker.py status "<task>"
  task-tracker.py list
  task-tracker.py clear "<task>"

Task data is stored in: ~/.openclaw/workspace/project/task-tracker/
(kept in workspace, not inside the skill package)
"""
import json, os, sys, datetime

TRACKER_DIR = os.path.expanduser("~/.openclaw/workspace/project/task-tracker")
os.makedirs(TRACKER_DIR, exist_ok=True)

def task_id(name):
    # Use hex encoding for safe filenames, preserving uniqueness
    return name.encode('utf-8').hex()

def load_task(name):
    path = os.path.join(TRACKER_DIR, f"{task_id(name)}.json")
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)

def save_task(name, data):
    path = os.path.join(TRACKER_DIR, f"{task_id(name)}.json")
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def cmd_new(name, steps_raw):
    steps = [s.strip() for s in steps_raw.split('|') if s.strip()]
    data = {
        "name": name,
        "status": "in_progress",
        "steps": steps,
        "done": [],
        "created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    save_task(name, data)
    print(f"[OK] Task created: {name} ({len(steps)} steps)")
    return data

def cmd_done(name, step_num):
    data = load_task(name)
    if not data:
        print(f"[ERROR] Task not found: {name}")
        return
    step_idx = int(step_num) - 1
    if step_idx not in data["done"]:
        data["done"].append(step_idx)
    data["done"].sort()
    if len(data["done"]) == len(data["steps"]):
        data["status"] = "completed"
    save_task(name, data)
    remaining = len(data["steps"]) - len(data["done"])
    if remaining == 0:
        print(f"[DONE] All steps completed!")
    else:
        print(f"[OK] Step {step_num} done. {remaining} remaining.")

def cmd_status(name):
    data = load_task(name)
    if not data:
        print(f"[ERROR] Task not found: {name}")
        return
    print(f"Task: {data['name']}")
    print(f"Status: {data['status']}  Progress: {len(data['done'])}/{len(data['steps'])}")
    print()
    for i, s in enumerate(data["steps"]):
        mark = "[x]" if i in data["done"] else "[ ]"
        print(f"  {mark} {i+1}. {s}")

def cmd_list():
    files = [f for f in os.listdir(TRACKER_DIR) if f.endswith('.json')]
    if not files:
        print("[INFO] No active tasks.")
        return
    print(f"[TASKS] {len(files)} active:")
    for f in sorted(files):
        with open(os.path.join(TRACKER_DIR, f)) as fp:
            d = json.load(fp)
        bar = "#" * len(d["done"]) + "-" * (len(d["steps"]) - len(d["done"]))
        print(f"  {d['name']} [{bar}] {len(d['done'])}/{len(d['steps'])}")

def cmd_clear(name):
    path = os.path.join(TRACKER_DIR, f"{task_id(name)}.json")
    if os.path.exists(path):
        os.remove(path)
        print(f"[DELETED] {name}")
    else:
        print(f"[ERROR] Task not found: {name}")

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "new" and len(sys.argv) >= 4:
        cmd_new(sys.argv[2], sys.argv[3])
    elif cmd == "done" and len(sys.argv) >= 4:
        cmd_done(sys.argv[2], sys.argv[3])
    elif cmd == "status" and len(sys.argv) >= 3:
        cmd_status(sys.argv[2])
    elif cmd == "list":
        cmd_list()
    elif cmd == "clear" and len(sys.argv) >= 3:
        cmd_clear(sys.argv[2])
    else:
        print("Usage:")
        print("  task-tracker.py new \"<task>\" \"<step1|step2|step3>\"")
        print("  task-tracker.py done \"<task>\" <step_number>")
        print("  task-tracker.py status \"<task>\"")
        print("  task-tracker.py list")
        print("  task-tracker.py clear \"<task>\"")
