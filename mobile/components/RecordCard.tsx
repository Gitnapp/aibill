import { View, Text } from "react-native";
import React from "react";

type Record = {
    id: number,
    title: string,
    amount: number,
    createdAt: string,
}

const RecordCard = ({record}: {record: Record}) => {
    return (
        <View className="bg-white p-4 rounded-xl mt-3">
            <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-800">{record.title}</Text>
                <Text className={`text-xl font-bold ${record.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>{record.amount}</Text>
            </View>
        </View>
    )
}

export default RecordCard