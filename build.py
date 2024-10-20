import subprocess


def run_command(command):
    try:
        print(f"Executing: {command}")
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")


def remove_container(container_name):
    # Check if container exists, then remove it
    command = f"docker rm -f {container_name}"
    run_command(command)


def remove_image(image_name):
    # Check if image exists, then remove it
    command = f"docker rmi -f {image_name}"
    run_command(command)


def main():

    # Step 3: Git pull to fetch the latest code
    run_command("git pull")

    # Step 4: Build the Docker image without using cache
    run_command("docker build  -t movies_app_nextjs .")

    # Step 1: Remove the existing container (if any)
    remove_container("movies_app_nextjs")

    # Step 5: Run the Docker container
    run_command(
        "docker run -d --name movies_app_nextjs -p 1001:3000 movies_app_nextjs")


if __name__ == "__main__":
    main()
