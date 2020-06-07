# Bind to IP/ports
bind = "0.0.0.0:80"

# Set up temp fs for Docker stuff
worker_tmp_dir = "/dev/shm"

# Set up number of workers/threads
workers = 2
threads = 4
worker_class = "gthread"