# DeXo Bad IP Blacklist

![GitHub](https://img.shields.io/github/license/DeXoHigh/dexo-ipblacklist)
![GitHub stars](https://img.shields.io/github/stars/DeXoHigh/dexo-ipblacklist?style=social)
![GitHub forks](https://img.shields.io/github/forks/DeXoHigh/dexo-ipblacklist?style=social)

DeXo Bad IP Blacklist is a Node.js script designed to automatically download and process IP blacklists from various sources and block the listed IPs using iptables. This script helps enhance the security of your server by preventing incoming and outgoing connections from known malicious IPs.

## Features

- Automatically download and process IP blacklists from multiple sources.
- Block malicious IPs using iptables.
- Customizable list of IP blacklist sources.
- Easy-to-use and configurable.

## Installation

1. Ensure you have Node.js installed on your server.
2. Download the DeXo Bad IP Blacklist script with this command:

```bash
git clone git@github.com:DeXoHigh/dexo-ipblacklist.git
```

3. Install the required Node.js packages by running the following command:

```bash
npm install
```

## Usage

# Configuration
> Open the app.js and customize the IP_BLACKLIST_URLS array to include the URLs of the IP blacklists you want to use.

## Running the Script:
> Start the script by running the following command:
```bash
npm run start
```
> Stop the script by running the following command:
```bash
npm run stop
```

## Automation:
> Schedule the script to run at regular intervals by adding it to your server's cron jobs or using a task scheduler.
For detailed usage instructions, see **[How to Use](#usage)** in the documentation.

### Contributing
> Contributions are welcome! If you would like to contribute to this project, please open an issue or submit a pull request.

### License
> This project is licensed under the MIT License - see the LICENSE file for details.

### Author
**[DeXoHigh](https://github.com/DeXoHigh)**

### Acknowledgments
> Special thanks to List of IP Addresses for providing IP blacklists.<br />
[LittleJake](https://github.com/LittleJake) <br />
[borestad](https://github.com/borestad)

### Support
> If you have questions or need assistance, please open an issue in the GitHub repository.
