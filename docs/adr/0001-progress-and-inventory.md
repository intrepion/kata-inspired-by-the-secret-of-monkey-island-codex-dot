# Derive inventory from permanent milestones

Item ownership is derived from acquisition and consumption milestones, rather than independently mutable bag entries. This trades arbitrary dropping and inventory scripting for a small auditable puzzle model, prevents duplicate acquisition and premature item loss, and allows exhaustive reachability verification. Saves contain only validated milestones and a location; dialogue and selected tools are transient.
