function customFunctions() {
  let exportFunctions = {
    firstName: firstName,
    totalAssignedFor: totalAssignedFor,
    assignedFor: assignedFor,
    wipFor: wipFor
  }

  let exec = (functionName, parameter) => {
    if (!exportFunctions[functionName]) {
      throw Error(`function ${functionName} not found`)
    }
    console.log(`${functionName}(${parameter})`)
    return exportFunctions[functionName](parameter);
  }
  return Object.freeze({
    exec: exec
  })
}
