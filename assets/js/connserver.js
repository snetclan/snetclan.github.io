function connectToServer(ip) {
    // Construct the steam://connect/ URI
    const steamUri = `steam://connect/${ip}`;
  
    // Open the URI (this will launch Steam and attempt to connect to the server)
    window.location.href = steamUri;
  
    // Prevent the default link behavior
    return false;
  }