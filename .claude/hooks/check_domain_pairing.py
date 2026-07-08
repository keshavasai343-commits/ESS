import json
import re
import sys


def main():
    data = json.load(sys.stdin)
    tool_input = data.get("tool_input", {})
    path = tool_input.get("file_path", "")
    path = path.replace("\\", "/")

    match = re.search(
        r"employee-portal/backend/app/(models|schemas|routers)/(\w+)\.py$", path
    )
    if not match:
        return

    domain = match.group(2)
    domain_class = "".join(part.capitalize() for part in domain.split("_"))
    message = (
        f"Backend '{domain}' domain file changed — check whether the matching "
        f"frontend files need the same update: "
        f"employee-portal/frontend/src/api/{domain}.ts and "
        f"employee-portal/frontend/src/hooks/use{domain_class}.ts"
    )
    print(json.dumps({
        "systemMessage": message,
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": message,
        },
    }))


if __name__ == "__main__":
    main()
