# Ubuntu 16.04
FROM daocloud.io/ubuntu:xenial

MAINTAINER Frank Zhao <syzhao1988@126.com>

# 替换镜像源
COPY docker_configs/sources.list /etc/apt/sources.list

# 安装依赖
RUN apt-get -y update \
    && apt-get -y install \
        apache2 \
        libapache2-mod-php \
        php7.0 \
        php7.0-mysql \
    # 清理工作
    && apt-get clean \
    && apt-get autoclean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# COPY Apache 与 PHP 配置文件
COPY docker_configs/site.conf /etc/apache2/sites-enabled/000-default.conf
COPY docker_configs/php.ini /usr/local/php/lib/php.ini

# 配置默认放置 App 的目录
RUN mkdir -p /app && rm -rf /var/www/html
COPY . /app
WORKDIR /app
# 链接 public 目录、创建 Log 目录并赋予权限
RUN ln -s /app/public /var/www/html && mkdir ./runtime && chmod -R 777 ./runtime && chmod 755 ./docker_configs/start.sh

EXPOSE 80
CMD ["./docker_configs/start.sh"]
