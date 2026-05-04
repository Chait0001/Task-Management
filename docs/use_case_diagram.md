# Use Case Diagram

```mermaid
flowchart LR
    User([User])
    System([System])

    subgraph TASKX System Boundary
        UC1(Create task)
        UC2(Edit task)
        UC3(Delete task)
        UC4(Mark task complete)
        UC5(Search tasks)
        UC6(Filter by status / priority)
        UC7(Enter Focus Mode)
        UC8(Run Pomodoro timer)
        UC9(View productivity score)
        UC10(Link task dependency)
        UC11(Auto-mark overdue tasks)
        
        UC_SmartDate(Smart date parse)
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC10

    UC_SmartDate -.->|extend| UC1
    UC7 -.->|include| UC8
    UC7 -.->|include| UC9

    UC11 <-- System
```
