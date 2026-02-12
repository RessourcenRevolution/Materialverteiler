---
title: Platform Management
---

# Platform Management

PocketBase is the backend system responsible for user management,
authentication, and data management.

## Accessing PocketBase

The following page contains a link to PocketBase: [Manage](/app/manage)

## Admin Access

To log into the Pocketbase interface, an admin account (Superuser) is required.
A new admin account can only be created using another admin account.

1. Open the 'System' collapse in the menu of the Collections section of
   Pocketbase
2. Choose \_superusers from the list
3. Use the 'New record' button to create a new admin account

## User Management

### User Roles

- **User**: Users with the "user" role are regular, confirmed users.
- **Manager**: Users with the "manager" role have administrative privileges and
  can manage other users.

### Approving Users

1. Navigate to the user list in PocketBase
2. Select the user you want to approve
3. Edit the user and assign them the "user" role
4. Save the changes

### Granting Manager Privileges

1. Navigate to the user list in PocketBase
2. Select the user you want to make a manager
3. Edit the user and assign them the "manager" role
4. Save the changes

## Listing Management

### Approving Listings

1. Navigate to the listings list in PocketBase
2. Select the listing you want to approve
3. Edit the listing and set the status to "open"
4. Save the changes

Possible listing statuses:

- **new**: Newly created, not yet approved
- **open**: Approved and visible (new listing e-mail gets send when changing to
  this status)
- **reserved**: Reserved, visible but not contact submission possible
- **success**: Successfully completed, no longer visible
- **failure**: Unsuccessfully completed, no longer visible
