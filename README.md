# IoT Device Management API

## Setup

Requires MongoDB running locally. Set `MONGODB_URI` in `.env` (defaults to `mongodb://localhost:27017/iot-devices`).

```bash
npm install
cp .env.example .env
npm run dev
```

## API

All `/api/*` routes require an `x-user-id` header (valid MongoDB ObjectId of an existing user).

| Method   | Path               | Description                         |
| -------- | ------------------ | ----------------------------------- |
| `GET`    | `/health`          | Health check                        |
| `GET`    | `/api/devices`     | List all devices (summary)          |
| `GET`    | `/api/devices/:id` | Device details + latest sensor data |
| `POST`   | `/api/devices`     | Register a new device               |
| `DELETE` | `/api/devices/:id` | Remove a device                     |
| `POST`   | `/api/actions`     | Send a command to a device          |

### Device control

Device state changes (on/off, reboot, adjust temperature, OTA updates) are modeled as **actions** rather than direct mutations of device document via `POST /api/actions`. This decision was done with thought about device actions history and possible queue processing in real world scenario.

Action types: `on`, `off`, `reboot`, `ota_update`, `adjust`

The `adjust` action requires a `metadata` object with `newValue`, `property`, and `unit`.

### Device validation

To imitate real device registration, `serialNumber` prefix is mapped to a device `model`.
If request will have different value endpoint will throw error

```bash
  'THR-100': { type: EDeviceType.thermostat, model: 'SmartTemp Pro 100' },
  'THR-200': { type: EDeviceType.thermostat, model: 'SmartTemp Elite 200' },
  'SA-100': { type: EDeviceType.smoke_alarm, model: 'SafeGuard Smoke 100' },
  'SA-300': { type: EDeviceType.smoke_alarm, model: 'SafeGuard Pro 300' },
```

## Seeding

Note: User creation is not implemented use seed to use prepopulated postman collection.

```bash
npm run seed
```

Populates the database with a sample user, device, sensor readings, and action history.

## Tests

```bash
npm test
```
