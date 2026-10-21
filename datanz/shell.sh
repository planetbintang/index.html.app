#!/usr/bin/env sh
# Shell CRUD/fetch untuk backend yang menyediakan API JSON.
API_URL="${DATANZ_API_URL:-/api/datanz}"

fetch_data() { curl -fsS "$API_URL/files"; }
create_data() { curl -fsS -X POST -H 'Content-Type: application/json' -d "$1" "$API_URL/files"; }
update_data() { curl -fsS -X PATCH -H 'Content-Type: application/json' -d "$2" "$API_URL/files/$1"; }
delete_data() { curl -fsS -X DELETE "$API_URL/files/$1"; }

case "${1:-fetch}" in
  fetch) fetch_data ;;
  create) create_data "${2:?JSON diperlukan}" ;;
  update) update_data "${2:?ID diperlukan}" "${3:?JSON diperlukan}" ;;
  delete) delete_data "${2:?ID diperlukan}" ;;
  *) echo "pakai: $0 fetch|create JSON|update ID JSON|delete ID" >&2; exit 2 ;;
esac
