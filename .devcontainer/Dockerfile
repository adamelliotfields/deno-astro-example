FROM mcr.microsoft.com/vscode/devcontainers/base:jammy

# install deno
RUN wget -nv -O /tmp/deno.zip https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip && \
unzip -od /usr/local/bin /tmp/deno.zip && \
chmod +x /usr/local/bin/deno && \
deno completions bash | tee /etc/bash_completion.d/deno > /dev/null && \
deno completions zsh | tee /usr/local/share/zsh/site-functions/_deno > /dev/null && \
rm -f /tmp/deno.zip

# install node
RUN git clone https://github.com/nvm-sh/nvm.git /home/vscode/.nvm --depth=1 && \
export NVM_DIR=/home/vscode/.nvm && \
export PATH="$NVM_DIR/bin:$PATH" && \
. $NVM_DIR/nvm.sh --no-use && \
nvm install 19.3.0 && \
nvm alias default 19.3.0 && \
echo '\n# NVM\nexport NVM_DIR=/home/vscode/.nvm\ntest -f $NVM_DIR/nvm.sh && source $NVM_DIR/nvm.sh' >> /home/vscode/.bashrc && \
echo '\n# NVM\nexport NVM_DIR=/home/vscode/.nvm\ntest -f $NVM_DIR/nvm.sh && source $NVM_DIR/nvm.sh' >> /home/vscode/.zshrc && \
chown -R vscode:vscode /home/vscode/.nvm

EXPOSE 3000
EXPOSE 8085
