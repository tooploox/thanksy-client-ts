#!/bin/sh

git rev-parse HEAD |sed -e 's/.*/BUILD_SHA="&"/' > .timestamp
date | sed -e 's/.*/BUILD_DATE="&"/' >> .timestamp
