package service

import (
	"github.com/skylinebear/east-api/setting/operation_setting"
	"github.com/skylinebear/east-api/setting/system_setting"
)

func GetCallbackAddress() string {
	if operation_setting.CustomCallbackAddress == "" {
		return system_setting.ServerAddress
	}
	return operation_setting.CustomCallbackAddress
}
