# Decisions: talos

This folder holds records of real decisions and the reasoning behind them.

## What goes here

A decision node records a choice that was made, the options considered, the reasoning that
led to the chosen option, and any conditions under which the decision should be revisited.
Decisions link back to the pillars and concepts that justified them. Typical content for this
namespace: why a control was chosen, why an action was made unreachable by design, how a
lifecycle stage is gated.

## What does not go here

General principles go in `pillars/`. Definitions and models go in `concepts/`. Ongoing
disputes go in `synthesis/`.

## When to add a decision node

Add a decision node when a non-obvious choice was made that future agents or operators might
question. If the reasoning is not recorded, the decision will be revisited repeatedly.

## Current state

This folder is seeded with this README only. Add one file per significant decision. Each
decision file carries full node frontmatter.
