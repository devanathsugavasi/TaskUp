// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'zone_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ZoneModel {

 String get zoneId; String get userId; String get name; String get color; String get icon; int get taskCount; String? get createdAt;
/// Create a copy of ZoneModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ZoneModelCopyWith<ZoneModel> get copyWith => _$ZoneModelCopyWithImpl<ZoneModel>(this as ZoneModel, _$identity);

  /// Serializes this ZoneModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ZoneModel&&(identical(other.zoneId, zoneId) || other.zoneId == zoneId)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.name, name) || other.name == name)&&(identical(other.color, color) || other.color == color)&&(identical(other.icon, icon) || other.icon == icon)&&(identical(other.taskCount, taskCount) || other.taskCount == taskCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,zoneId,userId,name,color,icon,taskCount,createdAt);

@override
String toString() {
  return 'ZoneModel(zoneId: $zoneId, userId: $userId, name: $name, color: $color, icon: $icon, taskCount: $taskCount, createdAt: $createdAt)';
}


}

/// @nodoc
abstract mixin class $ZoneModelCopyWith<$Res>  {
  factory $ZoneModelCopyWith(ZoneModel value, $Res Function(ZoneModel) _then) = _$ZoneModelCopyWithImpl;
@useResult
$Res call({
 String zoneId, String userId, String name, String color, String icon, int taskCount, String? createdAt
});




}
/// @nodoc
class _$ZoneModelCopyWithImpl<$Res>
    implements $ZoneModelCopyWith<$Res> {
  _$ZoneModelCopyWithImpl(this._self, this._then);

  final ZoneModel _self;
  final $Res Function(ZoneModel) _then;

/// Create a copy of ZoneModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? zoneId = null,Object? userId = null,Object? name = null,Object? color = null,Object? icon = null,Object? taskCount = null,Object? createdAt = freezed,}) {
  return _then(_self.copyWith(
zoneId: null == zoneId ? _self.zoneId : zoneId // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,color: null == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String,icon: null == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
as String,taskCount: null == taskCount ? _self.taskCount : taskCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ZoneModel].
extension ZoneModelPatterns on ZoneModel {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ZoneModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ZoneModel() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ZoneModel value)  $default,){
final _that = this;
switch (_that) {
case _ZoneModel():
return $default(_that);}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ZoneModel value)?  $default,){
final _that = this;
switch (_that) {
case _ZoneModel() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String zoneId,  String userId,  String name,  String color,  String icon,  int taskCount,  String? createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ZoneModel() when $default != null:
return $default(_that.zoneId,_that.userId,_that.name,_that.color,_that.icon,_that.taskCount,_that.createdAt);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String zoneId,  String userId,  String name,  String color,  String icon,  int taskCount,  String? createdAt)  $default,) {final _that = this;
switch (_that) {
case _ZoneModel():
return $default(_that.zoneId,_that.userId,_that.name,_that.color,_that.icon,_that.taskCount,_that.createdAt);}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String zoneId,  String userId,  String name,  String color,  String icon,  int taskCount,  String? createdAt)?  $default,) {final _that = this;
switch (_that) {
case _ZoneModel() when $default != null:
return $default(_that.zoneId,_that.userId,_that.name,_that.color,_that.icon,_that.taskCount,_that.createdAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ZoneModel implements ZoneModel {
  const _ZoneModel({required this.zoneId, required this.userId, required this.name, required this.color, this.icon = '', this.taskCount = 0, this.createdAt});
  factory _ZoneModel.fromJson(Map<String, dynamic> json) => _$ZoneModelFromJson(json);

@override final  String zoneId;
@override final  String userId;
@override final  String name;
@override final  String color;
@override@JsonKey() final  String icon;
@override@JsonKey() final  int taskCount;
@override final  String? createdAt;

/// Create a copy of ZoneModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ZoneModelCopyWith<_ZoneModel> get copyWith => __$ZoneModelCopyWithImpl<_ZoneModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ZoneModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ZoneModel&&(identical(other.zoneId, zoneId) || other.zoneId == zoneId)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.name, name) || other.name == name)&&(identical(other.color, color) || other.color == color)&&(identical(other.icon, icon) || other.icon == icon)&&(identical(other.taskCount, taskCount) || other.taskCount == taskCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,zoneId,userId,name,color,icon,taskCount,createdAt);

@override
String toString() {
  return 'ZoneModel(zoneId: $zoneId, userId: $userId, name: $name, color: $color, icon: $icon, taskCount: $taskCount, createdAt: $createdAt)';
}


}

/// @nodoc
abstract mixin class _$ZoneModelCopyWith<$Res> implements $ZoneModelCopyWith<$Res> {
  factory _$ZoneModelCopyWith(_ZoneModel value, $Res Function(_ZoneModel) _then) = __$ZoneModelCopyWithImpl;
@override @useResult
$Res call({
 String zoneId, String userId, String name, String color, String icon, int taskCount, String? createdAt
});




}
/// @nodoc
class __$ZoneModelCopyWithImpl<$Res>
    implements _$ZoneModelCopyWith<$Res> {
  __$ZoneModelCopyWithImpl(this._self, this._then);

  final _ZoneModel _self;
  final $Res Function(_ZoneModel) _then;

/// Create a copy of ZoneModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? zoneId = null,Object? userId = null,Object? name = null,Object? color = null,Object? icon = null,Object? taskCount = null,Object? createdAt = freezed,}) {
  return _then(_ZoneModel(
zoneId: null == zoneId ? _self.zoneId : zoneId // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,color: null == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String,icon: null == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
as String,taskCount: null == taskCount ? _self.taskCount : taskCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
