---
layout: post
title: "Nice-to-Have Buttons"
date: 2026-11-19 13:04:00 +0800
tags: [severed]
---


This task automation has brought an end to the era of confusion, frustration, and irritation among us operators.

Whether or not someone was in charge of bookkeeping, manually logging account movements at the end of the workday had been every rookie’s rite of passage on our team—a simple but awfully mundane task that counted for zero credit toward performance. On and off, I've handled the majority of it over the past four years. Keying every account, amount and currency that didn't had an API implemented. It was absurd how much manual work it required for daily financials to produce perfectly. No one had ever done it as well as I did, so I took back ownership more than once. But I also cried over it twice and stayed past six on plenty of occasions just to get it done on time and correctly.

So I figured it’d be nice to fix the *Status Button* while I was at it. The friction was meant to ensure operators checked the AI’s output and only moved forward after verifying it manually. There are four states: To-Do, WIP, Complete, and Cancel. The first three are restricted to that sequence and were built with the long-term idea of eventually syncing with other systems. So far, that feature has sat untouched since the day it was imagined. Because of how it was intended, we still have to click through the states blindly.

I’d open the dropdown menu, pick the next status, and try not to accidentally hit Cancel—*which I always did*. The Cancel button had no confirmation prompt, so clicking it would wipe out the entire logged row and forced me to start over. Naturally, this was something I wanted to fix urgently (probably more than automating the act of logging). I proposed redesigning it with a ➜ button for the next status and a ✖ button to cancel an entry. That would cut out three clicks and eliminate unnecessary cursor travel.

So I asked my boss if it was okay to file a ticket for what’s essentially a UI tweak.

> “It’s a nice-to-have. Don’t dump it on the engineers as a burden.”

Hold up! I figured the engineer would just drop my Jira ticket into the AI we’re paying too much for, and **POOF**, the fix would be done in minutes. QA would be us operators anyway. All the engineer has to do is review and commit. Why are we still expecting engineers to take the same amount of time to make fixes like this?

**P.S.** Yes, I have been viewing UI from more of a user perspective lately.
