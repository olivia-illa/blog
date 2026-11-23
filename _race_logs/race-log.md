---
title: Race Log

swimming:
  - event: "IRONMAN 70.3 Kenting"
    date: "2024-10-06"
    category: "Triathlon individual"
    km: 1.0
    time: "0:27:11"

  - event: "IRONMAN 70.3 Kenting"
    date: "2025-11-02"
    category: "Triathlon individual"
    km: 2.0
    time: "0:56:01"

  - event: "Challenge Taiwan"
    date: "2026-04-26"
    category: "Triathlon individual"
    km: 2.0
    time: "1:03:49"

cycling:
  - event: "IRONMAN 70.3 Kenting"
    date: "2024-10-06"
    category: "Triathlon individual"
    km: 90.0
    time: "3:48:09"

  - event: "IRONMAN 70.3 Kenting"
    date: "2025-11-02"
    category: "Triathlon individual"
    km: 90.0
    time: "4:06:00"

  - event: "Challenge Taiwan"
    date: "2026-04-26"
    category: "Triathlon individual"
    km: 90.0
    time: "3:54:31"

  - event: "IRONMAN 70.3 Kenting"
    date: "2026-11-01"
    category: "Triathlon relay (cycling)"
    km: 90.0
    time: "4:03:23"

running:
  - event: "IRONMAN 70.3 Kenting"
    date: "2022-10-02"
    category: "Triathlon relay (running)"
    km: 21.0975
    time: "3:02:36"

  - event: "Taipei Marathon"
    date: "2022-12-18"
    category: "Half marathon"
    km: 21.0975
    time: "2:17:52"

  - event: "New Taipei City Wan Jin Shi Marathon"
    date: "2023-03-19"
    category: "Challenge Run"
    km: 10.0
    time: "1:10:23"

  - event: "EVA Air Marathon"
    date: "2023-10-22"
    category: "10K"
    km: 10.0
    time: "0:56:20"

  - event: "Taipei Marathon"
    date: "2023-12-17"
    category: "Marathon"
    km: 42.195
    time: "4:29:58"

  - event: "PUMA Night Run"
    date: "2024-04-20"
    category: "Half marathon"
    km: 21.0975
    time: "2:29:24"

  - event: "Panasonic Taipei City Run"
    date: "2024-09-08"
    category: "Challenge Run"
    km: 10

  - event: "IRONMAN 70.3 Kenting"
    date: "2024-10-06"
    category: "Triathlon individual"
    km: 21.0
    time: "3:07:05"

  - event: "Standard Chartered Taipei Charity Marathon"
    date: "2025-01-12"
    category: "Half marathon"
    km: 21.0975
    time: "2:10:32"

  - event: "Sun Moon Lake Marathon"
    date: "2025-02-16"
    category: "29K"
    km: 29.0
    time: "3:37:10"

  - event: "New Taipei City Wan Jin Shi Marathon"
    date: "2025-03-16"
    category: "Challenge Run"
    km: 10.0
    time: "1:05:51"

  - event: "IRONMAN 70.3 Kenting"
    date: "2025-11-02"
    category: "Triathlon individual"
    km: 21.0
    time: "2:48:10"

  - event: "Taipei Marathon"
    date: "2025-12-21"
    category: "Half marathon"
    km: 21.0975
    time: "2:07:30"

  - event: "Tokyo Marathon"
    date: "2026-03-01"
    category: "Marathon"
    km: 42.195
    time: "4:36:04"

  - event: "New Taipei City Wan Jin Shi Marathon"
    date: "2026-03-15"
    category: "Challenge Run"
    km: 10.0
    time: "1:02:38"

  - event: "Challenge Taiwan"
    date: "2026-04-26"
    category: "Triathlon individual"
    km: 21.0
    time: "2:24:46"

  - event: "Sydney Marathon"
    date: "2026-08-30"
    category: "Marathon"
    km: 42.195
    time: "5:11:57"

---

# Race log

Add new races above the closing `---`, under `swimming`, `cycling`, or `running`.
Copy an existing entry or use this example.

```yaml
  - event: "Example 10K"
    date: "2027-03-14"
    category: "Challenge Run"
    km: 10
    time: "0:55:00"
```

- Use kilometres for `km` and a quoted `H:MM:SS` duration for `time`. Leave out `time` if you do not have a result yet.
- For a triathlon, add one entry per leg under its sport, using the leg distance and split time. Use `Triathlon individual`, `Triathlon relay (cycling)`, or `Triathlon relay (running)` as appropriate.
- Use `Marathon` and `Half marathon` for the Full and Half pop-up labels. Runs of 10 km display Challenge.
- The race page sorts by date and calculates pace, cycling speed, and totals automatically.
