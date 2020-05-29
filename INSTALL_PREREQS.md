## Setup Docker and Docker compose

To run the backend services for OpenAp Personal Food Computers, start by setting up Docker and docker-compose on your server machine.

### Install Docker Engine

Install the Docker Engine for your platform. (You can find [install directions on the docker website.](https://docs.docker.com/engine/install/)

I followed the instructions for [Ubuntu, setting it up via a repository](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository).

#### (Optional) Set up user to run docker
By default, you need to use the `sudo` command to run docker, if you'd like to use your user instead, follow the [instructions in the Linux Post Install](https://docs.docker.com/engine/install/linux-postinstall/) page.

### Install Docker-Compose
Follow the steps for you platform on the offical [docker-compose install page](https://docs.docker.com/compose/install/#install-compose)

## Optional 

### Portainer
A nice utility to monitor Docker images and containers, etc is [Portainer CE](https://www.portainer.io/products-services/portainer-community-edition/). Portainer community edition can be run as docker images, and provides a web interface to interact with Docker. [Installation instructions found here](https://www.portainer.io/installation/)
