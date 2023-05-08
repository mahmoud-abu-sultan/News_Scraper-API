const http = require("http");
const express = require("express");
const mongoose = require("mongoose");

const server = http.createServer();

const port = 6090;
server.listen(port, () => {
  console.log(`Running Server In Port:${port}`);
});
